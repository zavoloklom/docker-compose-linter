import type { ComposeDocument } from '../../domain/models/compose-document';
import type { LintIssue } from '../../domain/models/lint-issue';

interface ComposeValidator {
  isValid(document: ComposeDocument): boolean;
  validate(document: ComposeDocument): LintIssue[];
}

export { ComposeValidator };
