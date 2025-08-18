/* eslint-disable no-magic-numbers */
import test from 'ava';
import esmock from 'esmock';

import { makePerformanceTimer } from '../../../src/infrastructure/timer/performance-timer';

// ----------------------
// Helper functions
// ----------------------
// Creates a module with a mocked performance.now() returning values from the given array
const loadWithNowSequence = async (sequence: number[]) => {
  let callIndex = 0;
  const perfStub = {
    performance: {
      now: () => {
        // Return values from the sequence in order, repeat the last value if calls exceed length
        const safeIndex = Math.min(callIndex, sequence.length - 1);
        const value = sequence[safeIndex];
        callIndex += 1;
        return value;
      },
    },
  };

  // Import the tested module with mocked performance
  const module = await esmock<typeof import('../../../src/infrastructure/timer/performance-timer')>(
    '../../../src/infrastructure/timer/performance-timer',
    {
      'node:perf_hooks': perfStub,
    },
  );

  return { module, restore: () => esmock.purge(module) };
};

// ----------------------
// Tests
// ----------------------
test('read() and stop() before start should return 0', async (t) => {
  const { module } = await loadWithNowSequence([100]);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { PerformanceTimer } = module;

  const timer = new PerformanceTimer();
  t.is(timer.read('x'), 0);
  t.is(timer.stop('x'), 0);
});

test('start → read → stop cycle, read after stop should return 0', async (t) => {
  // Call order:
  // start() -> 100
  // read()  -> 150, result 150 - 100 = 50
  // stop()  -> 240, result 240 - 100 = 140
  // read()  -> 300, timer was removed -> 0

  const { module } = await loadWithNowSequence([100, 150, 240, 300]);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { PerformanceTimer } = module;

  const timer = new PerformanceTimer();
  timer.start('job');
  t.is(timer.read('job'), 50);
  t.is(timer.stop('job'), 140);
  t.is(timer.read('job'), 0);
});

test('starting the same label again overwrites the previous start time', async (t) => {
  // Call order:
  // start("a") -> 10
  // start("a") again -> 60 (overwrites)
  // read("a") -> 85, result 85 - 60 = 25
  // stop("a") -> 160, result 160 - 60 = 100

  const { module } = await loadWithNowSequence([10, 60, 85, 160]);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { PerformanceTimer } = module;

  const timer = new PerformanceTimer();
  timer.start('a');
  timer.start('a');
  t.is(timer.read('a'), 25);
  t.is(timer.stop('a'), 100);
});

test('different labels are independent; stop removes only its own label', async (t) => {
  // Call order:
  // start("a") -> 0
  // start("b") -> 5
  // read("a")  -> 25, result 25 - 0 = 25
  // read("b")  -> 40, result 40 - 5 = 35
  // stop("a")  -> 55, result 55 - 0 = 55
  // read("a")  -> removed -> 0
  // read("b")  -> 100, result 100 - 5 = 95

  const { module } = await loadWithNowSequence([0, 5, 25, 40, 55, 100]);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { PerformanceTimer } = module;

  const timer = new PerformanceTimer();
  timer.start('a');
  timer.start('b');

  t.is(timer.read('a'), 25);
  t.is(timer.read('b'), 35);

  t.is(timer.stop('a'), 55);
  t.is(timer.read('a'), 0);
  t.is(timer.read('b'), 95);
});

test('stopping a non-existing label should return 0 and not affect other labels', async (t) => {
  // Call order:
  // start("x") -> 10
  // stop("y")  -> label "y" does not exist -> 0
  // read("x")  -> 30, result 30 - 10 = 20

  const { module } = await loadWithNowSequence([10, 30]);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { PerformanceTimer } = module;

  const timer = new PerformanceTimer();
  timer.start('x');
  t.is(timer.stop('y'), 0);
  t.is(timer.read('x'), 20);
});

test('makePerformanceTimer(): returns correct values', (t) => {
  const fakeTimer = makePerformanceTimer(false);
  fakeTimer.start('x');
  t.is(fakeTimer.get('x'), 0);
  t.is(fakeTimer.read('x'), 0);
  t.is(fakeTimer.stop('x'), 0);

  const performanceTimer = makePerformanceTimer(true);
  performanceTimer.start('y');
  t.true(performanceTimer.get('y') === 0);
  t.true(performanceTimer.stop('y') > 0);
  t.true(performanceTimer.get('y') > 0);
});
