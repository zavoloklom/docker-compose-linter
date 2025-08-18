import { parseFileSuppressionComment, parseLineSuppressionComment } from './parse-suppression-comment';
import { SuppressionIndex } from './supression-index';

const buildSuppressionIndex = (content: string) => {
  const suppressionIndex = new SuppressionIndex();
  const lines = content.split('\n').map((line) => line.trim());

  let isFirstComment = true;
  for (const [index, line] of lines.entries()) {
    // Skip empty lines
    if (line === '' || line === '---') continue;
    // Check if the line is a comment
    const isCommentLine = line.startsWith('#');

    // Try to parse first comment in file
    if (isFirstComment) {
      const ruleIds = parseFileSuppressionComment(line);
      if (ruleIds.length > 0) suppressionIndex.addGlobal(new Set(ruleIds));
      isFirstComment = false;
    }

    // Parse comment for line directive
    const ruleIds = parseLineSuppressionComment(line);
    // Because index starting from 0
    const lineNumber = isCommentLine ? index + 2 : index + 1;

    if (ruleIds.length > 0) suppressionIndex.add(lineNumber, new Set(ruleIds));
  }

  return suppressionIndex;
};

export { buildSuppressionIndex };
