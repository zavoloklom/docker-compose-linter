import type { FormatterFunction } from '../../../src/formatters/formatter.types';

const dummyFormatter: FormatterFunction = (results) => {
  return 'dummy';
};

export { dummyFormatter };
