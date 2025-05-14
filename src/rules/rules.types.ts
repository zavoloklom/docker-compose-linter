import rules from './index';

type RuleClass = (typeof rules)[keyof typeof rules];
type RuleInstance = InstanceType<RuleClass>;
type RuleName = RuleInstance['name'];

type RuleType = 'warning' | 'error';

type RuleSeverity = 'info' | 'minor' | 'major' | 'critical';

type RuleCategory = 'style' | 'security' | 'best-practice' | 'performance';

interface Rule {
  name: RuleName; // The name of the rule, e.g. 'no-build-and-image'
  type: RuleType; // The type of the message, e.g. 'error'
  meta: RuleMeta; // Metadata about the rule, including description and URL
  category: RuleCategory; // Category under which this rule falls
  severity: RuleSeverity; // Default severity level for this rule
  fixable: boolean; // Is it possible to fix this
  options?: object; // Configurable options for this rule

  // Method for generating an error message if the rule is violated
  getMessage(details?: object): string;

  // Checks the file content and returns a list of lint messages
  check(content: object, type?: RuleType): RuleMessage[];

  // Auto-fix that corrects errors in the file and returns the fixed content
  fix?(content: string): string;
}

interface RuleMeta {
  description: string; // A brief description of the rule
  url: string; // A URL to documentation or resources related to the rule
}

interface RuleMessage {
  rule: RuleName; // Rule name, e.g. 'no-quotes-in-volumes'
  type: RuleType; // The type of the message, e.g. 'error'
  severity: RuleSeverity; // The severity level of the issue
  category: RuleCategory; // The category of the issue (style, security, etc.)
  message: string; // Error message
  line: number; // The line number where the issue is located
  column: number; // The column number where the issue starts
  endLine?: number; // The line number where the issue ends (optional)
  endColumn?: number; // The column number where the issue ends (optional)
  meta?: RuleMeta; // Metadata about the rule, including description and URL
  fixable: boolean; // Is it possible to fix this issue
  data: object;
}

interface RuleDefinition {
  name: RuleName;
  type: RuleType;
  category: RuleCategory;
  severity: RuleSeverity;
  fixable: boolean;
  meta: RuleMeta;
  hasFixFunction: boolean;
  hasOptions: boolean;
}

export { Rule, RuleDefinition, RuleName, RuleSeverity, RuleCategory, RuleType, RuleMeta, RuleMessage };
