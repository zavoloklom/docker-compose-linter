import test from 'ava';
import type { ExecutionContext } from 'ava';
import { Scalar, YAMLMap } from 'yaml';
import {
  extractPublishedPortValue,
  extractPublishedPortInferfaceValue,
  parsePortsRange,
} from '../../src/util/service-ports-parser.js';

// @ts-ignore TS2349
test('extractPublishedPortValue should return port from scalar value with no IP', (t: ExecutionContext) => {
  const scalarNode = new Scalar('8080:9000');
  const result = extractPublishedPortValue(scalarNode);
  t.is(result, '8080');
});

// @ts-ignore TS2349
test('extractPublishedPortValue should return correct port from scalar value with IP', (t: ExecutionContext) => {
  const scalarNode = new Scalar('127.0.0.1:3000');
  const result = extractPublishedPortValue(scalarNode);
  t.is(result, '3000');
});

// @ts-ignore TS2349
test('extractPublishedPortValue should return correct port from scalar value with IPv6', (t: ExecutionContext) => {
  const scalarNode = new Scalar('[::1]:3000');
  const result = extractPublishedPortValue(scalarNode);
  t.is(result, '3000');
});

// @ts-ignore TS2349
test('extractPublishedPortValue should return published port from map node', (t: ExecutionContext) => {
  const mapNode = new YAMLMap();
  mapNode.set('published', '8080');
  const result = extractPublishedPortValue(mapNode);
  t.is(result, '8080');
});

// @ts-ignore TS2349
test('extractPublishedPortValue should return empty string for unknown node type', (t: ExecutionContext) => {
  const result = extractPublishedPortValue({});
  t.is(result, '');
});

// @ts-ignore TS2349
test('parsePortsRange should return array of ports for a range', (t: ExecutionContext) => {
  t.deepEqual(parsePortsRange('3000-3002'), ['3000', '3001', '3002']);
  t.deepEqual(parsePortsRange('3000-3000'), ['3000']);
});

// @ts-ignore TS2349
test('extractPublishedPortInferfaceValue should return listen ip string for scalar without IP', (t: ExecutionContext) => {
  const scalarNode = new Scalar('8080:8080');
  const result = extractPublishedPortInferfaceValue(scalarNode);
  t.is(result, '');
});

// @ts-ignore TS2349
test('extractPublishedPortInferfaceValue should return listen ip string for scalar without IP and automapped port', (t: ExecutionContext) => {
  const scalarNode = new Scalar('8080');
  const result = extractPublishedPortInferfaceValue(scalarNode);
  t.is(result, '');
});

// @ts-ignore TS2349
test('extractPublishedPortInferfaceValue should return listen ip string for scalar on 127.0.0.1 with automapped port', (t: ExecutionContext) => {
  const scalarNode = new Scalar('127.0.0.1:8080');
  const result = extractPublishedPortInferfaceValue(scalarNode);
  t.is(result, '127.0.0.1');
});

// @ts-ignore TS2349
test('extractPublishedPortInferfaceValue should return listen ip string for scalar on 0.0.0.0 with automapped port', (t: ExecutionContext) => {
  const scalarNode = new Scalar('0.0.0.0:8080');
  const result = extractPublishedPortInferfaceValue(scalarNode);
  t.is(result, '0.0.0.0');
});

// @ts-ignore TS2349
test('extractPublishedPortInferfaceValue should return listen ip string for scalar on ::1 with automapped port', (t: ExecutionContext) => {
  const scalarNode = new Scalar('[::1]:8080');
  const result = extractPublishedPortInferfaceValue(scalarNode);
  t.is(result, '::1');
});

// @ts-ignore TS2349
test('extractPublishedPortInferfaceValue should return listen ip string for scalar on ::1 without automated port', (t: ExecutionContext) => {
  const scalarNode = new Scalar('[::1]:8080:8080');
  const result = extractPublishedPortInferfaceValue(scalarNode);
  t.is(result, '::1');
});

// @ts-ignore TS2349
test('parsePortsRange should return single port when no range is specified', (t: ExecutionContext) => {
  const result = parsePortsRange('8080');
  t.deepEqual(result, ['8080']);
});

// @ts-ignore TS2349
test('parsePortsRange should return empty array for invalid range', (t: ExecutionContext) => {
  t.deepEqual(parsePortsRange('$TEST'), []);
  t.deepEqual(parsePortsRange('$TEST-3002'), []);
  t.deepEqual(parsePortsRange('3000-$TEST'), []);
  t.deepEqual(parsePortsRange('$TEST-$TEST'), []);
  t.deepEqual(parsePortsRange('3000-$TEST-$TEST-5000'), []);
});

// @ts-ignore TS2349
test('parsePortsRange should return empty array when start port is greater than end port', (t: ExecutionContext) => {
  t.deepEqual(parsePortsRange('3005-3002'), []);
});
