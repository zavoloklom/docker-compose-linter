import type { FormatterFunction } from '../../domain/models/formatter';

const jsonFormatter: FormatterFunction = (lintSummary) => {
  return JSON.stringify(lintSummary, null, 2);
};

export { jsonFormatter };
