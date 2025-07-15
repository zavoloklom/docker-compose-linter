import composeSchema from '../../schemas/compose.schema.json' with { type: 'json' };
import linterConfigSchema from '../../schemas/linter-config.schema.json' with { type: 'json' };

const schemaLoader = (schemaName: string): Record<string, unknown> => {
  switch (schemaName) {
    case 'compose':
      return composeSchema;
    case 'linter-config':
      return linterConfigSchema;
    default:
      return {};
  }
};

export { schemaLoader };
