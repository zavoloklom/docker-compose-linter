import type { FormatterFunction } from './formatter.types';

const compactFormatter: FormatterFunction = (results) => {
  return results
    .map((result) => {
      return result.messages
        .map((error) => {
          return `${result.filePath}:${error.line}:${error.column} ${error.message} [${error.rule}]`;
        })
        .join('\n');
    })
    .join('\n\n');
};

export { compactFormatter };
