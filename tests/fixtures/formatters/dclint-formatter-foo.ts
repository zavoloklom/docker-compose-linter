import type { FormatterFunction } from '../../../src/domain/models/formatter';

const fooFormatter: FormatterFunction = (summary) => {
  return 'foo';
};

export { fooFormatter };
