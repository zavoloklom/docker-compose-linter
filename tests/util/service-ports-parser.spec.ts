import test from 'ava';
import { Scalar, YAMLMap } from 'yaml';

import {
  extractPublishedPortInterfaceValue,
  extractPublishedPortValueWithProtocol,
  parsePortsRange,
} from '../../src/util/service-ports-parser';

// @ts-ignore TS2349
test('extractPublishedPortValueWithProtocol should return port and default protocol from scalar value with no IP', (t) => {
  const scalarNode = new Scalar('8080:9000');
  const result = extractPublishedPortValueWithProtocol(scalarNode);
  t.deepEqual(result, { port: '8080', protocol: 'tcp' });
});

// @ts-ignore TS2349
test('extractPublishedPortValueWithProtocol should return correct port and protocol from scalar value with IP', (t) => {
  const scalarNode = new Scalar('127.0.0.1:3000/udp');
  const result = extractPublishedPortValueWithProtocol(scalarNode);
  t.deepEqual(result, { port: '3000', protocol: 'udp' });
});

// @ts-ignore TS2349
test('extractPublishedPortValueWithProtocol should return correct port and protocol from scalar value with IPv6', (t) => {
  const scalarNode = new Scalar('[::1]:3000/tcp');
  const result = extractPublishedPortValueWithProtocol(scalarNode);
  t.deepEqual(result, { port: '3000', protocol: 'tcp' });
});

// @ts-ignore TS2349
test('extractPublishedPortValueWithProtocol should return published port and default protocol from map node', (t) => {
  const mapNode = new YAMLMap();
  mapNode.set('published', '8080');
  const result = extractPublishedPortValueWithProtocol(mapNode);
  t.deepEqual(result, { port: '8080', protocol: 'tcp' });
});

// @ts-ignore TS2349
test('extractPublishedPortValueWithProtocol should return published port and specified protocol from map node', (t) => {
  const mapNode = new YAMLMap();
  mapNode.set('published', '8080');
  mapNode.set('protocol', 'udp');
  const result = extractPublishedPortValueWithProtocol(mapNode);
  t.deepEqual(result, { port: '8080', protocol: 'udp' });
});

// @ts-ignore TS2349
test('extractPublishedPortValueWithProtocol should return empty values for unknown node type', (t) => {
  const result = extractPublishedPortValueWithProtocol({});
  t.deepEqual(result, { port: '', protocol: 'tcp' });
});

// @ts-ignore TS2349
test('parsePortsRange should return array of ports for a range', (t) => {
  t.deepEqual(parsePortsRange('3000-3002'), ['3000', '3001', '3002']);
  t.deepEqual(parsePortsRange('3000-3000'), ['3000']);
});

// @ts-ignore TS2349
test('parsePortsRange should return empty array for invalid range', (t) => {
  t.deepEqual(parsePortsRange('$TEST'), []);
  t.deepEqual(parsePortsRange('$TEST-3002'), []);
  t.deepEqual(parsePortsRange('3000-$TEST'), []);
  t.deepEqual(parsePortsRange('$TEST-$TEST'), []);
  t.deepEqual(parsePortsRange('3000-$TEST-$TEST-5000'), []);
});

// @ts-ignore TS2349
test('parsePortsRange should return empty array when start port is greater than end port', (t) => {
  t.deepEqual(parsePortsRange('3005-3002'), []);
});

// @ts-ignore TS2349
test('extractPublishedPortInterfaceValue should return listen IP for scalar without IP', (t) => {
  const scalarNode = new Scalar('8080:8080');
  const result = extractPublishedPortInterfaceValue(scalarNode);
  t.is(result, '');
});

// @ts-ignore TS2349
test('extractPublishedPortInterfaceValue should return correct IP for scalar with IP', (t) => {
  const scalarNode = new Scalar('127.0.0.1:8080');
  const result = extractPublishedPortInterfaceValue(scalarNode);
  t.is(result, '127.0.0.1');
});

// @ts-ignore TS2349
test('extractPublishedPortInterfaceValue should return correct IP for scalar with IPv6', (t) => {
  const scalarNode = new Scalar('[::1]:8080');
  const result = extractPublishedPortInterfaceValue(scalarNode);
  t.is(result, '::1');
});

// @ts-ignore TS2349
test('extractPublishedPortInterfaceValue should return correct IP for scalar with IPv6 2', (t) => {
  const scalarNode = new Scalar('[2001:db8::1]:80');
  const result = extractPublishedPortInterfaceValue(scalarNode);
  t.is(result, '2001:db8::1');
});

// @ts-ignore TS2349
test('extractPublishedPortInterfaceValue should return empty string for unknown node type', (t) => {
  const result = extractPublishedPortInterfaceValue({});
  t.is(result, '');
});
