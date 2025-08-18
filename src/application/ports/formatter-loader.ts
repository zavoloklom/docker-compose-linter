import type { FormatterFunction } from '../../domain/models/formatter';

interface FormatterLoader {
  load(nameOrPath: string): Promise<FormatterFunction>;
}

export { FormatterLoader };
