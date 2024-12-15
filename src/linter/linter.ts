import fs from 'node:fs';
import { parseDocument, YAMLError } from 'yaml';
import type { Config } from '../config/config.types';
import type { LintRule, LintMessage, LintResult, LintContext } from './linter.types';
import { findFilesForLinting } from '../util/files-finder';
import { loadLintRules } from '../util/rules-utils';
import { Logger, LOG_SOURCE } from '../util/logger';
import { validationComposeSchema } from '../util/compose-validation';
import { ComposeValidationError } from '../errors/compose-validation-error';
import { loadFormatter } from '../util/formatter-loader';
import {
  extractDisableLineRules,
  extractGlobalDisableRules,
  startsWithDisableFileComment,
} from '../util/comments-handler';

const DEFAULT_CONFIG: Config = {
  debug: false,
  exclude: [],
  rules: {},
  quiet: false,
};

class DCLinter {
  private readonly config: Config;

  private rules: LintRule[];

  private logger: Logger;

  constructor(config?: Config) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.rules = [];
    this.logger = Logger.init(this.config?.debug);
  }

  private async loadRules() {
    if (this.rules.length === 0) {
      this.rules = await loadLintRules(this.config);
    }
  }

  private lintContent(context: LintContext): LintMessage[] {
    const messages: LintMessage[] = [];

    // Get globally disabled rules (from the first line)
    const globalDisableRules = extractGlobalDisableRules(context.sourceCode);
    const disableLineRules = extractDisableLineRules(context.sourceCode);

    this.rules.forEach((rule) => {
      // Ignore rule from comments
      if (globalDisableRules.has('*') || globalDisableRules.has(rule.name)) return;

      const ruleMessages = rule.check(context).filter((message) => {
        const disableRulesForLine = disableLineRules.get(message.line);

        if (disableRulesForLine && disableRulesForLine.has('*')) {
          return false;
        }

        return !disableRulesForLine || !disableRulesForLine.has(rule.name);
      });
      messages.push(...ruleMessages);
    });

    return messages;
  }

  private fixContent(content: string): string {
    let fixedContent = content;
    const globalDisableRules = extractGlobalDisableRules(fixedContent);

    this.rules.forEach((rule) => {
      // Ignore rule from comments
      if (globalDisableRules.has('*') || globalDisableRules.has(rule.name)) return;

      if (typeof rule.fix === 'function') {
        fixedContent = rule.fix(fixedContent);
      }
    });

    return fixedContent;
  }

  private static validateFile(file: string): { context: LintContext | null; messages: LintMessage[] } {
    const messages: LintMessage[] = [];
    const context: LintContext = { path: file, content: {}, sourceCode: '' };

    try {
      context.sourceCode = fs.readFileSync(file, 'utf8');
      const parsedDocument = parseDocument(context.sourceCode, { merge: true });

      if (parsedDocument.errors && parsedDocument.errors.length > 0) {
        parsedDocument.errors.forEach((error) => {
          throw error;
        });
      }

      // Use Record<string, unknown> to type the parsed content safely
      context.content = parsedDocument.toJS() as Record<string, unknown>;
      validationComposeSchema(context.content);
    } catch (error: unknown) {
      if (error instanceof YAMLError) {
        const startPos: { line: number; col: number } | undefined = Array.isArray(error.linePos)
          ? error.linePos[0]
          : error.linePos;
        messages.push({
          rule: 'invalid-yaml',
          category: 'style',
          severity: 'critical',
          message: 'Invalid YAML format.',
          line: startPos?.line || 1,
          column: startPos?.col || 1,
          type: 'error',
          fixable: false,
        });
      } else if (error instanceof ComposeValidationError) {
        messages.push({
          rule: 'invalid-schema',
          type: 'error',
          category: 'style',
          severity: 'critical',
          message: error.toString(),
          line: 1,
          column: 1,
          fixable: false,
        });
      } else {
        messages.push({
          rule: 'unknown-error',
          category: 'style',
          severity: 'critical',
          message: 'unknown-error',
          line: 1,
          column: 1,
          type: 'error',
          fixable: false,
        });
      }

      return { context: null, messages };
    }

    if (startsWithDisableFileComment(context.sourceCode)) {
      return { context: null, messages };
    }

    return { context, messages };
  }

  public async lintFiles(paths: string[], doRecursiveSearch: boolean): Promise<LintResult[]> {
    const lintResults: LintResult[] = [];
    await this.loadRules();
    const files = findFilesForLinting(paths, doRecursiveSearch, this.config.exclude);
    this.logger.debug(LOG_SOURCE.LINTER, `Compose files for linting: ${files.toString()}`);

    files.forEach((file) => {
      this.logger.debug(LOG_SOURCE.LINTER, `Linting file: ${file}`);

      const { context, messages } = DCLinter.validateFile(file);
      if (context) {
        const fileMessages = this.lintContent(context);
        messages.push(...fileMessages);
      }

      const errorCount = messages.filter((message) => message.type === 'error').length;
      const warningCount = messages.filter((message) => message.type === 'warning').length;
      const fixableErrorCount = messages.filter((message) => message.fixable && message.type === 'error').length;
      const fixableWarningCount = messages.filter((message) => message.fixable && message.type === 'warning').length;

      lintResults.push({
        filePath: file,
        messages,
        errorCount,
        warningCount,
        fixableErrorCount,
        fixableWarningCount,
      });
    });

    this.logger.debug(LOG_SOURCE.LINTER, 'Linting result:', JSON.stringify(lintResults));
    return lintResults;
  }

  public async fixFiles(paths: string[], doRecursiveSearch: boolean, dryRun: boolean = false): Promise<void> {
    await this.loadRules();
    const files = findFilesForLinting(paths, doRecursiveSearch, this.config.exclude);
    this.logger.debug(LOG_SOURCE.LINTER, `Compose files for fixing: ${files.toString()}`);

    files.forEach((file) => {
      this.logger.debug(LOG_SOURCE.LINTER, `Fixing file: ${file}`);

      const { context, messages } = DCLinter.validateFile(file);
      if (!context) {
        this.logger.debug(LOG_SOURCE.LINTER, `Skipping file due to validation errors: ${file}`);
        messages.forEach((message) => this.logger.debug(LOG_SOURCE.LINTER, JSON.stringify(message)));
        return;
      }

      const content = this.fixContent(context.sourceCode);

      if (dryRun) {
        this.logger.info(`Dry run - changes for file: ${file}`);
        this.logger.info('\n\n', content);
      } else {
        fs.writeFileSync(file, content, 'utf8');
        this.logger.debug(LOG_SOURCE.LINTER, `File fixed: ${file}`);
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  public async formatResults(lintResults: LintResult[], formatterName: string) {
    const formatter = await loadFormatter(formatterName);
    return formatter(lintResults);
  }
}

export { DCLinter };
