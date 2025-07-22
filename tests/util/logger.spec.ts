/* eslint-disable no-console */
import test from 'ava';
import pc from 'picocolors';

import { LogSource, Logger } from '../../src/util/logger';

const originalDebug = console.debug;
const originalInfo = console.info;
const originalWarn = console.warn;
const originalError = console.error;

// Reset singleton before each test
test.beforeEach((t) => {
  // @ts-expect-error TS2571: Object is of type unknown
  // eslint-disable-next-line no-undefined
  (Logger as unknown).instance = undefined;
});

test.afterEach(() => {
  // Restore console methods after each test
  console.debug = originalDebug;
  console.info = originalInfo;
  console.warn = originalWarn;
  console.error = originalError;
});

test('info() always logs with [INFO] prefix', (t) => {
  const calls: unknown[][] = [];
  console.info = (...options: unknown[]) => {
    calls.push(options);
  };

  const logger = Logger.init();
  logger.info('payload', 1);

  const expectedPrefix = pc.green('[INFO]');

  t.is(calls[0][0], expectedPrefix);
  t.deepEqual(calls[0].slice(1), ['payload', 1]);
});

test('warn() always logs with [WARN] prefix', (t) => {
  const calls: unknown[][] = [];
  console.warn = (...options: unknown[]) => {
    calls.push(options);
  };

  const logger = Logger.init();
  logger.warn('w1', 'w2');

  const expectedPrefix = pc.yellow('[WARN]');

  t.is(calls[0][0], expectedPrefix);
  t.deepEqual(calls[0].slice(1), ['w1', 'w2']);
});

test('error() always logs with [ERROR] prefix', (t) => {
  const calls: unknown[][] = [];
  console.error = (...options: unknown[]) => {
    calls.push(options);
  };

  const logger = Logger.init();
  logger.error('e1');

  const expectedPrefix = pc.red('[ERROR]');

  t.is(calls[0][0], expectedPrefix);
  t.deepEqual(calls[0].slice(1), ['e1']);
});

test('debug() should log when debugMode=true', (t) => {
  const calls: unknown[][] = [];
  console.debug = (...options: unknown[]) => {
    calls.push(options);
  };

  // DebugMode true
  const logger = Logger.init(true);
  logger.debug(LogSource.UTIL, 'd2', 1);

  const expectedPrefix = `${pc.blue('[DEBUG]')} [${LogSource.UTIL}]`;

  t.is(calls[0][0], expectedPrefix);
  t.deepEqual(calls[0].slice(1), ['d2', 1]);
});

test('debug() should not log when debugMode=false', (t) => {
  const calls: unknown[][] = [];
  console.debug = (...options: unknown[]) => {
    calls.push(options);
  };

  // DebugMode false by default
  const logger = Logger.init(false);
  logger.debug(LogSource.CLI, 'd1');

  t.is(calls.length, 0);
});
