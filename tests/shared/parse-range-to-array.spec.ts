import test from 'ava';

import { parseRangeToArray } from '../../src/shared/parse-range-to-array';

test('parsePortsRange should return array for one element', (t) => {
  t.deepEqual(parseRangeToArray('3000'), ['3000']);
});

test('parsePortsRange should return array for a range', (t) => {
  t.deepEqual(parseRangeToArray('3000-3002'), ['3000', '3001', '3002']);
  t.deepEqual(parseRangeToArray('3000-3000'), ['3000']);
});

test('parsePortsRange should return empty array for invalid range', (t) => {
  t.deepEqual(parseRangeToArray('$TEST'), []);
  t.deepEqual(parseRangeToArray('$TEST-3002'), []);
  t.deepEqual(parseRangeToArray('3000-$TEST'), []);
  t.deepEqual(parseRangeToArray('$TEST-$TEST'), []);
  t.deepEqual(parseRangeToArray('3000-$TEST-$TEST-5000'), []);
});

test('parsePortsRange should return empty array when start is greater than end', (t) => {
  t.deepEqual(parseRangeToArray('3005-3002'), []);
});
