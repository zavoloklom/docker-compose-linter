import test from 'ava';

import { normalizeServicePort } from '../../../src/domain/compose/normalize-service-port';

test('normalizeServicePort(): should return correct value for 3000', (t) => {
  const scalarNode = '3000';
  const result = normalizeServicePort(scalarNode);
  t.deepEqual(result, { hostIP: null, host: null, container: '3000', protocol: null });
});

test('normalizeServicePort(): should return correct value for 8080:9000', (t) => {
  const scalarNode = '8080:9000';
  const result = normalizeServicePort(scalarNode);
  t.deepEqual(result, { hostIP: null, host: '8080', container: '9000', protocol: null });
});

test('normalizeServicePort(): should return correct value for ranges 9090-9091:8080-8081', (t) => {
  const scalarNode = '9090-9091:8080-8081';
  const result = normalizeServicePort(scalarNode);
  t.deepEqual(result, { hostIP: null, host: '9090-9091', container: '8080-8081', protocol: null });
});

test('normalizeServicePort(): should return correct value for ranges 127.0.0.1:5000-5010:5000-5010', (t) => {
  const scalarNode = '127.0.0.1:5000-5010:5000-5010';
  const result = normalizeServicePort(scalarNode);
  t.deepEqual(result, { hostIP: '127.0.0.1', host: '5000-5010', container: '5000-5010', protocol: null });
});

test('normalizeServicePort(): should return correct value for 127.0.0.1:3000', (t) => {
  const scalarNode = '127.0.0.1:3000';
  const result = normalizeServicePort(scalarNode);
  t.deepEqual(result, { hostIP: '127.0.0.1', host: null, container: '3000', protocol: null });
});

test('normalizeServicePort(): should return correct value for IPv6 [::1]:3000', (t) => {
  const scalarNode = '[::1]:3000';
  const result = normalizeServicePort(scalarNode);
  t.deepEqual(result, { hostIP: '::1', host: null, container: '3000', protocol: null });
});

test('normalizeServicePort(): should return correct value for full IPv4 127.0.0.1:3000:8000/tcp', (t) => {
  const scalarNode = '127.0.0.1:3000:8000/udp';
  const result = normalizeServicePort(scalarNode);
  t.deepEqual(result, { hostIP: '127.0.0.1', host: '3000', container: '8000', protocol: 'udp' });
});

test('normalizeServicePort(): should return correct value for full IPv6 [::]:3000:8000/tcp', (t) => {
  const scalarNode = '[::]:3000:8000/udp';
  const result = normalizeServicePort(scalarNode);
  t.deepEqual(result, { hostIP: '::', host: '3000', container: '8000', protocol: 'udp' });
});
