import type { FormatterFunction } from '../../../src/domain/models/formatter';

const dummyFormatter: FormatterFunction = (summary) => {
  return 'dummy';
};

export { dummyFormatter };
