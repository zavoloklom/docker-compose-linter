import test from 'ava';

import { makeFormatUseCase } from '../../../src/application/use-cases/format';
import { lintSummaryExample } from '../../fixtures/diagnostics/lint-summary-example';
import { InMemoryLogger } from '../../fixtures/logger/in-memory-logger';

import type { FormatterFunction } from '../../../src/domain/models/formatter';

// ----------------------
// Tests
// ----------------------
test('get results from formatter', async (t) => {
  const mocks = {
    formatterLoader: {
      // eslint-disable-next-line @typescript-eslint/require-await
      load: async (nameOrPath: string): Promise<FormatterFunction> => {
        return (lintSummary) => 'FormatterOutput';
      },
    },
    logger: new InMemoryLogger(),
  };
  const formatUseCase = makeFormatUseCase(mocks);

  const formatterResult = await formatUseCase(lintSummaryExample, 'fakeName');

  t.is(formatterResult, 'FormatterOutput');
});
