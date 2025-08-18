/**
 * Parse a suppression directive from a raw comment text (without '#' prefix normalization).
 * Supports:
 *   dclint disable                    -> ['*']
 *   dclint disable no-foo             -> ['no-foo']
 *   dclint disable no-foo no-bar      -> ['no-foo', 'no-bar']
 *   dclint disable-line               -> ['*']
 *   dclint disable-line no-foo        -> ['no-foo']
 *   dclint disable-line no-foo no-bar -> ['no-foo', 'no-bar']
 */
const parseSuppressionComment = (raw: string, pattern: string): string[] => {
  const text = String(raw).trim();

  // Match pattern
  const disableMatch = new RegExp(`dclint\\s+${pattern}\\s*(?<rules>.*)`, 'u').exec(text);
  if (!disableMatch?.groups) return [];

  const rules = disableMatch.groups.rules.trim();

  // No explicit ids -> wildcard
  if (rules === '') return ['*'];

  // Split by comma, trim, remove empties
  return rules
    .split(' ')
    .map((rule) => rule.trim())
    .filter(Boolean);
};

const parseFileSuppressionComment = (raw: string): string[] => {
  return parseSuppressionComment(raw, 'disable');
};

const parseLineSuppressionComment = (raw: string): string[] => {
  return parseSuppressionComment(raw, 'disable-line');
};

export { parseFileSuppressionComment, parseLineSuppressionComment };
