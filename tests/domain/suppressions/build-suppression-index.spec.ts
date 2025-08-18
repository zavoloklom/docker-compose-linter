/* eslint-disable no-magic-numbers */
import test from 'ava';

import { buildSuppressionIndex } from '../../../src/domain/supressions/build-suppression-index';

test('buildSuppressionIndex(): returns correct suppression index', (t) => {
  const yamlContent = `
  # dclint disable rule-1
  # line
---  

version: '3.9'

# dclint disable-line
services:
  c-service:
    build: # dclint disable-line rule-2
      context: ../../tests/c-service
      dockerfile: Dockerfile
      args:
        - TEST=
    environment:
      - TEST='HQTb_=d.4*FPN@^;w2)UZ%'
  # ignored-comment
  # dclint disable-line rule-2
  test:
    # dclint disable-line rule-3 rule-14
    build: "" # dclint disable-line rule-3 rule-16
    image2: node
    container_name: a-service
  `;

  const suppressionIndex = buildSuppressionIndex(yamlContent);

  // Check globals
  t.deepEqual(suppressionIndex.listGlobals(), ['rule-1']);

  // Check lines
  const expected = [
    [9, ['*']],
    [11, ['rule-2']],
    [20, ['rule-2']],
    [22, ['rule-3', 'rule-14', 'rule-16']],
  ];
  t.deepEqual(suppressionIndex.list(), expected);
});

test('buildSuppressionIndex(): should disable rules for line if # dclint disable-line is a first comment', (t) => {
  const content = `
    # dclint disable-line
    key: value 1
    # dclint disable
    key: value 2
  `;
  const suppressionIndex = buildSuppressionIndex(content);
  t.deepEqual(
    suppressionIndex.list(),
    [[3, ['*']]], // '*' means all rules disabled
  );
});

test('buildSuppressionIndex(): returns empty suppression index if there are no comments', (t) => {
  const yamlContent = `
# line
---  
version: '3.9'
  `;

  const suppressionIndex = buildSuppressionIndex(yamlContent);

  // Check globals
  t.deepEqual(suppressionIndex.listGlobals(), []);

  // Check lines
  t.deepEqual(suppressionIndex.list(), []);
});
