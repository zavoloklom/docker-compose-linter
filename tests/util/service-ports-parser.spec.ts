import test from 'ava';
import { Scalar, YAMLMap } from 'yaml';
import { extractPublishedPortValue, parsePortsRange } from '../../src/util/service-ports-parser.js';

test('extractPublishedPortValue should return port from scalar value with no IP', (t) => {
    const scalarNode = new Scalar('8080:9000');
    const result = extractPublishedPortValue(scalarNode);
    t.is(result, '8080');
});

test('extractPublishedPortValue should return correct port from scalar value with IP', (t) => {
    const scalarNode = new Scalar('127.0.0.1:3000');
    const result = extractPublishedPortValue(scalarNode);
    t.is(result, '3000');
});

test('extractPublishedPortValue should return published port from map node', (t) => {
    const mapNode = new YAMLMap();
    mapNode.set('published', '8080');
    const result = extractPublishedPortValue(mapNode);
    t.is(result, '8080');
});

test('extractPublishedPortValue should return empty string for unknown node type', (t) => {
    const result = extractPublishedPortValue({});
    t.is(result, '');
});

test('parsePortsRange should return array of ports for a range', (t) => {
    t.deepEqual(parsePortsRange('3000-3002'), ['3000', '3001', '3002']);
    t.deepEqual(parsePortsRange('3000-3000'), ['3000']);
});

test('parsePortsRange should return single port when no range is specified', (t) => {
    const result = parsePortsRange('8080');
    t.deepEqual(result, ['8080']);
});

test('parsePortsRange should return empty array for invalid range', (t) => {
    t.deepEqual(parsePortsRange('$TEST'), []);
    t.deepEqual(parsePortsRange('$TEST-3002'), []);
    t.deepEqual(parsePortsRange('3000-$TEST'), []);
    t.deepEqual(parsePortsRange('$TEST-$TEST'), []);
    t.deepEqual(parsePortsRange('3000-$TEST-$TEST-5000'), []);
});

test('parsePortsRange should return empty array when start port is greater than end port', (t) => {
    t.deepEqual(parsePortsRange('3005-3002'), []);
});
