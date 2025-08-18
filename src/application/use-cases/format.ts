import { type Logger } from '../ports/logger';

import type { LintSummary } from '../../domain/models/lint-summary';
import type { FormatterLoader } from '../ports/formatter-loader';

type FormatUseCase = (lintSummary: LintSummary, nameOrPath: string) => Promise<string>;

type FormatUseCaseDeps = {
  logger: Logger;
  formatterLoader: FormatterLoader;
};

// TODO: Log more info
const formatUseCase = async (
  lintSummary: LintSummary,
  nameOrPath: string,
  deps: FormatUseCaseDeps,
): Promise<string> => {
  const { formatterLoader } = deps;

  const formatter = await formatterLoader.load(nameOrPath);

  return formatter(lintSummary);
};

const makeFormatUseCase = (deps: FormatUseCaseDeps): FormatUseCase => {
  return (lintSummary, nameOrPath) => formatUseCase(lintSummary, nameOrPath, deps);
};

export { makeFormatUseCase, type FormatUseCase, type FormatUseCaseDeps };
