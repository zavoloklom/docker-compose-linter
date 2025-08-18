import test from 'ava';

import { normalizeServiceImage } from '../../../src/domain/compose/normalize-service-image';

test('normalizeServiceImage(): should return correct value for redis', (t) => {
  const image = 'redis';
  const result = normalizeServiceImage(image);
  t.deepEqual(result, { registry: null, path: [], image: 'redis', tag: null, digest: null });
});

test('normalizeServiceImage(): should return correct value for redis:5', (t) => {
  const image = 'redis:5';
  const result = normalizeServiceImage(image);
  t.deepEqual(result, { registry: null, path: [], image: 'redis', tag: '5', digest: null });
});

test('normalizeServiceImage(): should return correct value for ranges redis@sha256:0ed5d5...', (t) => {
  const image = 'redis@sha256:0ed5d5928d4737458944eb604cc8509e245c3e19d02ad83935398bc4b991aac7';
  const result = normalizeServiceImage(image);
  t.deepEqual(result, {
    registry: null,
    path: [],
    image: 'redis',
    tag: null,
    digest: 'sha256:0ed5d5928d4737458944eb604cc8509e245c3e19d02ad83935398bc4b991aac7',
  });
});

test('normalizeServiceImage(): should return correct value for ranges library/redis', (t) => {
  const image = 'library/redis';
  const result = normalizeServiceImage(image);
  t.deepEqual(result, { registry: null, path: ['library'], image: 'redis', tag: null, digest: null });
});

test('normalizeServiceImage(): should return correct value for docker.io/library/redis', (t) => {
  const image = 'docker.io/library/redis';
  const result = normalizeServiceImage(image);
  t.deepEqual(result, { registry: 'docker.io', path: ['library'], image: 'redis', tag: null, digest: null });
});

test('normalizeServiceImage(): should return correct value for my_private.registry:5000/redis', (t) => {
  const image = 'my_private.registry:5000/redis';
  const result = normalizeServiceImage(image);
  t.deepEqual(result, { registry: 'my_private.registry:5000', path: [], image: 'redis', tag: null, digest: null });
});

test('normalizeServiceImage(): should return correct value for empty value', (t) => {
  const result = normalizeServiceImage('');
  t.deepEqual(result, { registry: null, path: [], image: '', tag: null, digest: null });
});

test('normalizeServiceImage(): should return correct value for .3000', (t) => {
  const image = '.3000';
  const result = normalizeServiceImage(image);
  t.deepEqual(result, { registry: '.3000', path: [], image: '', tag: null, digest: null });
});
