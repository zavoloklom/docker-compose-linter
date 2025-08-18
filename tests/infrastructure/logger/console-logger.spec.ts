/* eslint-disable no-console */
import anyTest, { TestFn } from 'ava';
import stripAnsi from 'strip-ansi';

import { LogSource } from '../../../src/application/ports/logger';
import { ConsoleLogger } from '../../../src/infrastructure/logger/console-logger';

// ----------------------
// Test context
// ----------------------
type TestContext = {
  calls: string[][];
};

const test = anyTest as TestFn<TestContext>;

// ----------------------
// Hooks
// ----------------------
const originalDebug = console.debug;
const originalInfo = console.info;
const originalWarn = console.warn;
const originalError = console.error;

test.beforeEach((t) => {
  t.context.calls = [];
  // Mock console
  console.info = (...options: string[]) => {
    t.context.calls.push(options);
  };
  console.warn = (...options: string[]) => {
    t.context.calls.push(options);
  };
  console.error = (...options: string[]) => {
    t.context.calls.push(options);
  };
  console.debug = (...options: string[]) => {
    t.context.calls.push(options);
  };
});

test.afterEach(() => {
  // Restore console methods after each test
  console.debug = originalDebug;
  console.info = originalInfo;
  console.warn = originalWarn;
  console.error = originalError;

  // Reset singleton after each test
  // @ts-expect-error TS2571: Object is of type unknown
  // eslint-disable-next-line no-undefined
  (ConsoleLogger as unknown).INSTANCE = undefined;
});

// ----------------------
// Tests
// ----------------------
test('info() always logs with [INFO] prefix', (t) => {
  const logger = ConsoleLogger.init();
  logger.info('payload', '1');

  const expectedPrefix = '[INFO]';

  t.is(stripAnsi(t.context.calls[0][0]), expectedPrefix);
  t.deepEqual(t.context.calls[0].slice(1), ['payload', '1']);
});

test('warn() always logs with [WARN] prefix', (t) => {
  const logger = ConsoleLogger.init();
  logger.warn('w1', 'w2');

  const expectedPrefix = '[WARN]';

  t.is(stripAnsi(t.context.calls[0][0]), expectedPrefix);
  t.deepEqual(t.context.calls[0].slice(1), ['w1', 'w2']);
});

test('error() always logs with [ERROR] prefix', (t) => {
  const logger = ConsoleLogger.init();
  logger.error('e1');

  const expectedPrefix = '[ERROR]';

  t.is(stripAnsi(t.context.calls[0][0]), expectedPrefix);
  t.deepEqual(t.context.calls[0].slice(1), ['e1']);
});

test('debug() should log when debugMode=true', (t) => {
  const logger = ConsoleLogger.init(true);
  logger.debug(LogSource.UTIL, 'd2', '1');

  const expectedPrefix = `[DEBUG] [${LogSource.UTIL}]`;

  t.is(stripAnsi(t.context.calls[0][0]), expectedPrefix);
  t.deepEqual(t.context.calls[0].slice(1), ['d2', '1']);
});

test('debug() should not log when debugMode=false', (t) => {
  const logger = ConsoleLogger.init(false);
  logger.debug(LogSource.CLI, 'd1');

  t.is(t.context.calls.length, 0);
});

test('ConsoleLogger.getColoredLevel() have default value', (t) => {
  // @ts-expect-error TS2576: Property getColoredLevel does not exist on type ConsoleLogger
  t.is(stripAnsi(ConsoleLogger.getColoredLevel('TEST_LEVEL')), '[TEST_LEVEL]');
});
