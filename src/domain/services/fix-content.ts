import { ComposeDocument } from '../models/compose-document';
import { Rule } from '../models/rule';

const fixContent = (document: ComposeDocument, rules: Rule[]): string => {
  let fixedDocument = document;
  // Exit if all rules globally suppressed
  if (document.suppressions.isSuppressed('*')) return fixedDocument.toString();

  for (const rule of rules) {
    // Continue if rule is globally suppressed
    if (document.suppressions.isSuppressed(rule.id)) continue;

    if (rule.fixable && typeof rule.fix === 'function') {
      fixedDocument = rule.fix(document);
    }
  }

  return fixedDocument.toString();
};

export { fixContent };
