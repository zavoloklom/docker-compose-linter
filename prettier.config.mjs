const config = {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  rangeStart: 0,
  rangeEnd: Number.POSITIVE_INFINITY,
  requirePragma: false,
  proseWrap: 'preserve',
  arrowParens: 'always',
  endOfLine: 'lf',
  quoteProps: 'as-needed',
  objectWrap: 'preserve',
  plugins: ['prettier-plugin-packagejson'],
  overrides: [
    {
      files: '*.md',
      options: {
        parser: 'markdown',
        printWidth: 120,
        tabWidth: 2,
        useTabs: false,
        semi: false,
        singleQuote: false,
        trailingComma: 'none',
        proseWrap: 'always',
        embeddedLanguageFormatting: 'off',
      },
    },
    {
      files: ['**/*.css', '**/*.scss'],
      options: {
        singleQuote: false,
      },
    },
    {
      files: ['**/*.html'],
      options: {
        singleQuote: false,
        tabWidth: 4,
        htmlWhitespaceSensitivity: 'css',
        singleAttributePerLine: false,
      },
    },
  ],
};

// eslint-disable-next-line import/no-default-export
export default config;
