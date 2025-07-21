import type { FormatterFunction } from './formatter.types';

const jsonFormatter: FormatterFunction = (results) => {
  return JSON.stringify(results, null, 2);
};

export { jsonFormatter };
