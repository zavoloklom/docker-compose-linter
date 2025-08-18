/* eslint-disable no-magic-numbers */
import anyTest, { TestFn } from 'ava';

import { FileDiscoveryOptions } from '../../../src/application/ports/file-finder';
import { type LintUseCase, makeLintUseCase } from '../../../src/application/use-cases/lint';
import { ComposeDocument } from '../../../src/domain/models/compose-document';
import { LintIssue } from '../../../src/domain/models/lint-issue';
import { Rule } from '../../../src/domain/models/rule';
import { InMemoryLogger } from '../../fixtures/logger/in-memory-logger';

import type { Config } from '../../../src/application/dto/config';
import type { ComposeDocumentFactory } from '../../../src/application/ports/compose-document-factory';
import type { ComposeValidator } from '../../../src/application/ports/compose-validator';
import type { RulesLoader } from '../../../src/application/ports/rules-loader';
import type { Timer } from '../../../src/application/ports/timer';
import type { LintSummary } from '../../../src/domain/models/lint-summary';

// ----------------------
// Test context
// ----------------------
type Mocks = {
  rulesLoader: RulesLoader;
  composeDocumentFactory: ComposeDocumentFactory;
  composeValidator: ComposeValidator;
  logger: InMemoryLogger;
  timer: Timer;
  lintContentImpl: (document: ComposeDocument, rules: Rule[]) => LintIssue[];
};

type TestContext = { mocks: Mocks; lintUseCase: LintUseCase };

const test = anyTest as TestFn<TestContext>;

// ----------------------
// Helpers
// ----------------------
const FILE_A = '/repo/a.yml';
const FILE_B = '/repo/b.yml';
const FILE_C = '/repo/c.yml';

// ----------------------
// Hooks
// ----------------------
test.beforeEach((t) => {
  const composeDocumentFactory = {
    __lastArgs: {},
    // eslint-disable-next-line @typescript-eslint/require-await
    fromPath: async (paths: string[], options: Partial<FileDiscoveryOptions>): Promise<ComposeDocument[]> => {
      // eslint-disable-next-line no-underscore-dangle
      composeDocumentFactory.__lastArgs = { paths, options };
      // @ts-expect-error is missing the properties from type
      return [{ filePath: FILE_A }, { filePath: FILE_B }, { filePath: FILE_C }];
    },
  };

  const mocks: Mocks = {
    rulesLoader: {
      // eslint-disable-next-line @typescript-eslint/require-await
      load: async (config): Promise<Rule[]> => {
        // @ts-expect-error is missing the properties from type
        return [{ id: 'R1' }, { id: 'R2' }];
      },
    },
    composeDocumentFactory,
    composeValidator: {
      isValid: () => true,
      validate: (document): LintIssue[] => {
        if (document.filePath === FILE_A) {
          // @ts-expect-error is missing the properties from type
          return [{ code: 'E001', message: 'Invalid frontmatter' }];
        }
        return [];
      },
    },
    lintContentImpl: (document, rules): LintIssue[] => {
      if (document.filePath !== FILE_C) {
        // @ts-expect-error is missing the properties from type
        return [{ code: 'E002', message: 'Invalid Rule' }];
      }
      return [];
    },
    logger: new InMemoryLogger(),
    timer: {
      start: () => {},
      stop: () => 0,
      read: () => 0,
      get: () => 0,
    },
  };

  t.context.mocks = mocks;
  t.context.lintUseCase = makeLintUseCase(mocks);
});

// ----------------------
// Tests
// ----------------------
test('logs rules count; returns one report per document; a.yml contains only validation issues', async (t) => {
  const { lintUseCase } = t.context;

  const config: Config = { exclude: ['node_modules', 'dist'] } as unknown as Config;

  const summary: LintSummary = await lintUseCase(['./repo'], config);

  // One report per document.
  t.true(Array.isArray(summary.reports));

  t.is(summary.reports.length, 3);

  // For file A: only validation issues must be present.
  const reportA = summary.reports.find((report) => report.filePath === FILE_A);
  t.truthy(reportA, 'report for a.yml must exist');
  const issuesA = reportA?.issues;
  t.deepEqual(issuesA, [{ code: 'E001', message: 'Invalid frontmatter' }], 'a.yml must contain only validation issues');

  // For file B: issues array must exist (validator returned none; linter may add more).
  const reportB = summary.reports.find((report) => report.filePath === FILE_B);
  t.truthy(reportB, 'report for b.yml must exist');
  const issuesB = reportB?.issues;
  t.deepEqual(issuesB, [{ code: 'E002', message: 'Invalid Rule' }], 'b.yml must contain only linter issues');

  // For file C: no issues
  const reportC = summary.reports.find((report) => report.filePath === FILE_C);
  t.truthy(reportC, 'report for c.yml must exist');
  t.is(reportC?.issues.length, 0);
});

test('passes timing stats to summary when config.stats = true', async (t) => {
  const { mocks } = t.context;

  // Timer that returns fixed values for get()
  const timer: Timer = {
    start: () => {},
    stop: () => 0,
    read: () => 0,
    get: (label: string) => {
      if (label === 'parse') return 12;
      if (label === 'operation') return 34;
      if (label === 'total') return 56;
      return 0;
    },
  };

  // Spy summary factory to capture stats argument
  let capturedStats: unknown;
  let callCount = 0;
  const createLintSummaryImpl = (reports: unknown, stats: unknown) => {
    callCount += 1;
    capturedStats = stats;
    // Return a minimal LintSummary-like object
    return { reports } as unknown as LintSummary;
  };

  const lintUseCaseWithStats = makeLintUseCase({
    ...mocks,
    timer,
    createLintSummaryImpl,
  });

  const configWithStats = { stats: true } as unknown as Config;
  const summary = await lintUseCaseWithStats(['./repo'], configWithStats);

  t.truthy(summary);
  t.is(callCount, 1, 'createLintSummaryImpl should be called once');

  // Ensure stats argument is passed and mapped correctly
  t.deepEqual(capturedStats, {
    times: { parse: 12, lint: 34, total: 56 },
  });

  // Sanity: still produces one report per document
  t.true(Array.isArray(summary.reports));
  t.is(summary.reports.length, 3);
});
