import type { FormatterFunction } from '../../../src/formatters/formatter.types';

const fooFormatter: FormatterFunction = (results) => {
  return 'foo';
};

export { fooFormatter };
