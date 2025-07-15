import { Document, ToStringOptions, parseDocument } from 'yaml';

const YAML_STRINGIFY_OPTIONS: ToStringOptions = {
  blockQuote: true,
  collectionStyle: 'any',
  defaultKeyType: null,
  defaultStringType: 'PLAIN',
  directives: null,
  doubleQuotedAsJSON: false,
  doubleQuotedMinMultiLineLength: 40,
  falseStr: 'false',
  flowCollectionPadding: true,
  indent: 2,
  indentSeq: true,
  lineWidth: 0, // See #136
  minContentWidth: 20,
  nullStr: 'null',
  simpleKeys: false,
  singleQuote: null,
  trueStr: 'true',
  verifyAliasOrder: true,
};

const parseYAML = (content: string): Document.Parsed => {
  return parseDocument(content);
};

const stringifyDocument = (document: Document.Parsed): string => {
  return document.toString(YAML_STRINGIFY_OPTIONS);
};

export { parseYAML, stringifyDocument };
