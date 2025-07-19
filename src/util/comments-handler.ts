const startsWithDisableFileComment = (content: string): boolean => {
  // Split content into lines and process the first non-empty, non-YAML separator line
  const lines = content.split('\n').map((line) => line.trim());
  for (const line of lines) {
    if (line === '' || line === '---') continue;
    return line.startsWith('# dclint disable-file');
  }
  return false;
};

const extractGlobalDisableRules = (content: string): Set<string> => {
  const disableRules = new Set<string>();

  // Split content into lines and process the first non-empty, non-YAML separator line
  const lines = content.split('\n').map((line) => line.trim());
  for (const line of lines) {
    if (line === '' || line === '---') continue;
    const disableMatch = /#\s*dclint\s+disable\s*(?<rules>.*)/u.exec(line);
    if (disableMatch?.groups) {
      const rules = disableMatch.groups.rules.trim();

      // If no specific rules are provided, disable all rules
      if (rules === '') {
        disableRules.add('*');
      } else {
        // Otherwise, disable specific rules mentioned
        rules.split(/\s+/u).forEach((rule) => disableRules.add(rule));
      }
    }
    break;
  }

  return disableRules;
};

const extractDisableLineRules = (content: string): Map<number, Set<string>> => {
  const disableRulesPerLine = new Map<number, Set<string>>();
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Check if the line is a comment
    const isCommentLine = line.trim().startsWith('#');
    const lineNumber = isCommentLine ? index + 2 : index + 1;

    const disableMatch = /#\s*dclint\s+disable-line\s*(?<rules>.*)/u.exec(line);
    if (!disableMatch?.groups) return;

    const rules = disableMatch.groups.rules.trim();

    if (!disableRulesPerLine.has(lineNumber)) {
      disableRulesPerLine.set(lineNumber, new Set());
    }

    // If no specific rule is provided, disable all rules
    if (rules === '') {
      disableRulesPerLine.get(lineNumber)?.add('*');
    } else {
      rules.split(/\s+/u).forEach((rule) => disableRulesPerLine.get(lineNumber)?.add(rule));
    }
  });

  return disableRulesPerLine;
};

export { startsWithDisableFileComment, extractGlobalDisableRules, extractDisableLineRules };
