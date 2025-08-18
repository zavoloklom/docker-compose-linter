import { createLintFileReport } from '../../domain/diagnostics/create-lint-file-report';
import { createLintSummary } from '../../domain/diagnostics/create-lint-summary';
import { lintContent } from '../../domain/services/lint-content';
import { type Logger } from '../ports/logger';

import type { ComposeDocument } from '../../domain/models/compose-document';
import type { LintFileReport } from '../../domain/models/lint-file-report';
import type { LintIssue } from '../../domain/models/lint-issue';
import type { LintStats, LintSummary } from '../../domain/models/lint-summary';
import type { Rule } from '../../domain/models/rule';
import type { Config } from '../dto/config';
import type { ComposeDocumentFactory } from '../ports/compose-document-factory';
import type { ComposeValidator } from '../ports/compose-validator';
import type { RulesLoader } from '../ports/rules-loader';
import type { Timer } from '../ports/timer';

type LintUseCase = (paths: string[], config: Config) => Promise<LintSummary>;

type LintUseCaseDeps = {
  rulesLoader: RulesLoader;
  composeDocumentFactory: ComposeDocumentFactory;
  composeValidator: ComposeValidator;
  logger: Logger;
  timer: Timer;
  // Dependency injection for testability:
  lintContentImpl?: (document: ComposeDocument, rules: Rule[]) => LintIssue[];
  createLintFileReportImpl?: (path: string, issues: LintIssue[]) => LintFileReport;
  createLintSummaryImpl?: (reports: LintFileReport[], stats?: Pick<LintStats, 'times'>) => LintSummary;
};

// TODO: Log more info
const lintUseCase = async (paths: string[], config: Config, deps: LintUseCaseDeps): Promise<LintSummary> => {
  const {
    rulesLoader,
    composeDocumentFactory,
    composeValidator,
    timer,
    lintContentImpl,
    createLintFileReportImpl,
    createLintSummaryImpl,
  } = deps;

  const checkContent = lintContentImpl ?? lintContent;
  const makeFileReport = createLintFileReportImpl ?? createLintFileReport;
  const makeSummary = createLintSummaryImpl ?? createLintSummary;

  timer.start('total');

  const rules = await rulesLoader.load(config);

  const fileDiscoveryOptions = {
    recursive: config.recursive,
    exclude: config.exclude,
  };
  timer.start('parse');
  const documents = await composeDocumentFactory.fromPath(paths, fileDiscoveryOptions);
  timer.stop('parse');

  timer.start('operation');
  const lintReports: LintFileReport[] = [];
  for (const document of documents) {
    const issues = [];
    const validationIssues = composeValidator.validate(document);
    issues.push(...validationIssues);
    if (validationIssues.length === 0) {
      const lintIssues = checkContent(document, rules);
      issues.push(...lintIssues);
    }
    lintReports.push(makeFileReport(document.filePath, issues));
  }
  timer.stop('operation');

  timer.stop('total');

  return config.stats
    ? makeSummary(lintReports, {
        times: { parse: timer.get('parse'), lint: timer.get('operation'), total: timer.get('total') },
      })
    : makeSummary(lintReports);
};

const makeLintUseCase = (deps: LintUseCaseDeps): LintUseCase => {
  return (paths, config) => lintUseCase(paths, config, deps);
};

export { makeLintUseCase, type LintUseCaseDeps, type LintUseCase };
