function startsWithDisableFileComment(content: string): boolean {
  // Split content into lines and process the first non-empty, non-YAML separator line
  const lines = content.split('\n').map((line) => line.trim());
  for (const line of lines) {
    // eslint-disable-next-line no-continue
    if (line === '' || line === '---') continue;
    return line.startsWith('# dclint disable-file');
  }
  return false;
}

function extractGlobalDisableRules(content: string): Set<string> {
  const disableRules = new Set<string>();

  // Split content into lines and process the first non-empty, non-YAML separator line
  const lines = content.split('\n').map((line) => line.trim());
  for (const line of lines) {
    // eslint-disable-next-line no-continue
    if (line === '' || line === '---') continue;
    const disableMatch = line.match(/#\s*dclint\s+disable\s*(.*)/);
    if (disableMatch) {
      const rules = disableMatch[1].trim();

      // If no specific rules are provided, disable all rules
      if (rules === '') {
        disableRules.add('*');
      } else {
        // Otherwise, disable specific rules mentioned
        rules.split(/\s+/).forEach((rule) => disableRules.add(rule));
      }
    }
    break;
  }

  return disableRules;
}

function extractDisableLineRules(content: string): Map<number, Set<string>> {
  const disableRulesPerLine = new Map<number, Set<string>>();
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Check if the line is a comment
    const isCommentLine = line.trim().startsWith('#');
    const lineNumber = isCommentLine ? index + 2 : index + 1;

    const disableMatch = line.match(/#\s*dclint\s+disable-line\s*(.*)/);
    if (!disableMatch) return;

    const rules = disableMatch[1].trim();

    if (!disableRulesPerLine.has(lineNumber)) {
      disableRulesPerLine.set(lineNumber, new Set());
    }

    // If no specific rule is provided, disable all rules
    if (rules === '') {
      disableRulesPerLine.get(lineNumber)?.add('*');
    } else {
      rules.split(/\s+/).forEach((rule) => disableRulesPerLine.get(lineNumber)?.add(rule));
    }
  });

  return disableRulesPerLine;
}

export { startsWithDisableFileComment, extractGlobalDisableRules, extractDisableLineRules };
