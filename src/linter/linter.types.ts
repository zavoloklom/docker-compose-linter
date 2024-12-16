interface LintContext {
  path: string;
  content: object;
  sourceCode: string;
}

interface LintMessage {
  rule: string; // Rule name, e.g. 'no-quotes-in-volumes'
  type: LintMessageType; // The type of the message, e.g. 'error'
  severity: LintRuleSeverity; // The severity level of the issue
  category: LintRuleCategory; // The category of the issue (style, security, etc.)
  message: string; // Error message
  line: number; // The line number where the issue is located
  column: number; // The column number where the issue starts
  endLine?: number; // The line number where the issue ends (optional)
  endColumn?: number; // The column number where the issue ends (optional)
  meta?: RuleMeta; // Metadata about the rule, including description and URL
  fixable: boolean; // Is it possible to fix this issue
  data: object;
}

interface LintResult {
  filePath: string; // Path to the file that was linted
  messages: LintMessage[]; // Array of lint messages (errors and warnings)
  errorCount: number; // Total number of errors found
  warningCount: number; // Total number of warnings found
  fixableErrorCount?: number; // Total number of fixable errors (optional)
  fixableWarningCount?: number; // Total number of fixable warnings (optional)
}

interface RuleMeta {
  description: string; // A brief description of the rule
  url: string; // A URL to documentation or resources related to the rule
}

interface LintRule {
  name: string; // The name of the rule, e.g. 'no-build-and-image'
  type: LintMessageType; // The type of the message, e.g. 'error'
  meta: RuleMeta; // Metadata about the rule, including description and URL
  category: LintRuleCategory; // Category under which this rule falls
  severity: LintRuleSeverity; // Default severity level for this rule
  fixable: boolean; // Is it possible to fix this
  options?: object; // Configurable options for this rule

  // Method for generating an error message if the rule is violated
  getMessage(details?: object): string;

  // Checks the file content and returns a list of lint messages
  check(content: object, type?: LintMessageType): LintMessage[];

  // Auto-fix that corrects errors in the file and returns the fixed content
  fix?(content: string): string;
}

interface LintRuleDefinition {
  name: string;
  type: LintMessageType;
  category: LintRuleCategory;
  severity: LintRuleSeverity;
  fixable: boolean;
  meta: RuleMeta;
  hasFixFunction: boolean;
  hasOptions: boolean;
}

type LintMessageType = 'warning' | 'error';

type LintRuleSeverity = 'info' | 'minor' | 'major' | 'critical';

type LintRuleCategory = 'style' | 'security' | 'best-practice' | 'performance';

export {
  LintContext,
  LintMessage,
  LintResult,
  LintRule,
  RuleMeta,
  LintRuleDefinition,
  LintMessageType,
  LintRuleSeverity,
  LintRuleCategory,
};
