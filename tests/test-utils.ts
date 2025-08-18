// eslint-disable-next-line ava/use-test
import { type ExecutionContext } from 'ava';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { InMemoryLogger, InMemoryLoggerMessage } from './fixtures/logger/in-memory-logger';

import type { ComposeDocument } from '../src/domain/models/compose-document';
import type { Rule } from '../src/domain/models/rule';

const normalizeYAML = (yaml: string) => yaml.replaceAll(/\s+/gu, ' ').trim();

// For working with FS
const createFileAtPath = async (path: string, content = ''): Promise<void> => {
  await mkdir(resolve(path, '..'), { recursive: true });
  await writeFile(path, content, 'utf8');
};

// For log messages
const inMemoryLoggerHasSubstring = (logger: InMemoryLogger, type: string, substring: string): boolean => {
  let messages: InMemoryLoggerMessage[] = [];
  switch (type) {
    case 'debug':
      messages = logger.debugMessages;
      break;
    case 'error':
      messages = logger.errorMessages;
      break;
    case 'warn':
      messages = logger.warnMessages;
      break;
    case 'info':
      messages = logger.infoMessages;
      break;
    default:
      break;
  }
  return messages.some((record) => record.message.join(' ').includes(substring));
};

// Helper for testing rules
type ExpectedIssue = {
  message: string;
  line?: number;
};

const runRuleTest = (t: ExecutionContext, rule: Rule, context: ComposeDocument, expectedIssues: ExpectedIssue[]) => {
  const errors = rule.check(context);

  t.is(errors.length, expectedIssues.length, 'Number of errors should match the number of expected messages.');

  for (const [index, expectedData] of expectedIssues.entries()) {
    // Check message
    t.is(errors[index].message, expectedData.message);
    // Check line
    if (expectedData.line) {
      t.is(errors[index].line, expectedData.line);
    }
  }
};

export { normalizeYAML, runRuleTest, createFileAtPath, inMemoryLoggerHasSubstring, type ExpectedIssue };
