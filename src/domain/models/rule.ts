import { ComposeDocument } from './compose-document';
import { LintIssue } from './lint-issue';

/**
 * The type of lint messages: warning or error.
 */
enum RuleType {
  WARNING = 'warning',
  ERROR = 'error',
}

/**
 * The severity levels for lint rules.
 */
enum RuleSeverity {
  INFO = 'info',
  MINOR = 'minor',
  MAJOR = 'major',
  CRITICAL = 'critical',
}

/**
 * Categories under which lint rules can be grouped.
 */
enum RuleCategory {
  SYNTAX = 'syntax',
  STYLE = 'style',
  SECURITY = 'security',
  BEST_PRACTICE = 'best-practice',
  PERFORMANCE = 'performance',
}

/**
 * Metadata about a lint rule, including description and documentation URL.
 */
interface RuleMeta {
  /** A brief description of what the rule checks for. */
  description: string;
  /** URL to documentation or resources related to the rule. */
  url: string;
}

/**
 * Contract for a linting rule that can check AST documents and optionally auto-fix them.
 *
 * @template TContext - Additional context for RuleMessage.
 * @template TOptions - Type of the options specific to the rule.
 */
interface Rule<TContext = object, TOptions = object> {
  /** Unique identifier for the rule, e.g. 'no-build-and-image'. */
  readonly id: string;
  /** The type of lint message produced by this rule. */
  readonly type: RuleType;
  /** Metadata including description and documentation link. */
  readonly meta: RuleMeta;
  /** Category under which this rule falls. */
  readonly category: RuleCategory;
  /** Severity level assigned to this rule. */
  readonly severity: RuleSeverity;
  /** Indicates whether this rule supports automatic fixing. */
  readonly fixable: boolean;
  /** Configuration options specific to the rule. */
  readonly options?: TOptions;

  /**
   * Generate a message string describing the rule violation.
   * @param context Optional violation context to include in the message.
   */
  getMessage(context?: TContext): string;

  /**
   * Check the given Compose document and return any lint messages.
   * @param document Compose document to check.
   */
  check(document: ComposeDocument): LintIssue<TContext>[];

  /**
   * Optionally auto-fix the given Compose document according to this rule.
   * If not implemented, no fixes will be applied.
   * @param document Compose document to fix.
   */
  fix?(document: ComposeDocument): ComposeDocument;
}

export { RuleType, RuleSeverity, RuleCategory, type RuleMeta, type Rule };
