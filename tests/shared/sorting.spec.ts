/* eslint-disable no-magic-numbers */
import test from 'ava';

import {
  findViolationsInAlphabeticalOrder,
  findViolationsInOrder,
  isElementInAlphabeticalOrder,
  isElementInOrder,
  isSortedAlphabetically,
  isSortedByOrder,
  sortAlphabetically,
  sortByOrder,
} from '../../src/shared/sorting';

test('isSortedAlphabetically(): should return correct values', (t) => {
  t.true(isSortedAlphabetically(['3000', '3001', 3002]));
  t.true(isSortedAlphabetically(['apple2', 'apple10', 'banana']));
  t.true(
    isSortedAlphabetically(
      [
        { name: 'Alice', age: 60 },
        { name: 'Bob', age: 50 },
      ],
      (user) => user.name,
    ),
  );

  t.false(isSortedAlphabetically(['3000', '3001', '3002', 10]));
  t.false(isSortedAlphabetically([10, 2]));
});

test('isSortedByOrder(): should return correct values', (t) => {
  const correctOrder = ['low', 'medium', 'high'];

  t.true(isSortedByOrder(['low', 'medium'], correctOrder));
  t.true(
    isSortedByOrder(
      [{ level: 'low' }, { level: 'medium' }, { level: 'high' }, { level: 'other' }],
      correctOrder,
      (x) => x.level,
    ),
  );

  t.false(isSortedByOrder(['high', 'low', 'medium'], correctOrder));
  t.false(isSortedByOrder([{ level: 'medium' }, { level: 'low' }], correctOrder, (x) => x.level));
});

test('isElementAlphabeticallyInOrder(): should return correct values for flat array', (t) => {
  const array = ['3000', '3001', 2000];

  t.true(isElementInAlphabeticalOrder(array, 0));
  t.true(isElementInAlphabeticalOrder(array, 1));
  t.false(isElementInAlphabeticalOrder(array, 2));
});

test('isElementAlphabeticallyInOrder(): should return correct values for objects', (t) => {
  const array = [
    { name: 'Alice', age: 60 },
    { name: 'Bob2', age: 50 },
    { name: 'Bob10', age: 50 },
  ];

  t.true(isElementInAlphabeticalOrder(array, 0, (x) => x.name));
  t.true(isElementInAlphabeticalOrder(array, 1));
  t.true(isElementInAlphabeticalOrder(array, 2));
});

test('isElementInOrder(): should return correct values for flat array', (t) => {
  const correctOrder = ['low', 'medium', 'high'];

  let array = ['low', 'medium'];
  t.true(isElementInOrder(array, correctOrder, 0));
  t.true(isElementInOrder(array, correctOrder, 1));

  array = ['high', 'medium', 'low', 'other'];
  t.true(isElementInOrder(array, correctOrder, 0));
  t.false(isElementInOrder(array, correctOrder, 1));
  t.false(isElementInOrder(array, correctOrder, 2));
  t.true(isElementInOrder(array, correctOrder, 3));
});

test('isElementInOrder(): should return correct values for objects', (t) => {
  const correctOrder = ['low', 'medium', 'high'];

  const array = [{ level: 'low' }, { level: 'medium' }, { level: 'high' }, { level: 'other' }];
  t.true(isElementInOrder(array, correctOrder, 0, (x) => x.level));
  t.true(isElementInOrder(array, correctOrder, 1, (x) => x.level));
  t.true(isElementInOrder(array, correctOrder, 2, (x) => x.level));
});

test('findViolationsInAlphabeticalOrder(): should return correct values', (t) => {
  t.deepEqual(findViolationsInAlphabeticalOrder(['3000', '3001', 3002]), []);
  t.deepEqual(findViolationsInAlphabeticalOrder(['apple2', 'apple10', 'banana']), []);
  t.deepEqual(
    findViolationsInAlphabeticalOrder(
      [
        { name: 'Alice', age: 60 },
        { name: 'Bob', age: 50 },
      ],
      (user) => user.name,
    ),
    [],
  );

  t.deepEqual(findViolationsInAlphabeticalOrder(['3000', '3001', '3002', 10]), [
    {
      current: {
        index: 3,
        value: '10',
      },
      previous: {
        index: 2,
        value: '3002',
      },
    },
  ]);
});

test('findViolationsInOrder(): should return correct values', (t) => {
  const correctOrder = ['low', 'medium', 'high'];

  t.deepEqual(findViolationsInOrder(['low', 'medium'], correctOrder), []);
  t.deepEqual(
    findViolationsInOrder(
      [{ level: 'low' }, { level: 'medium' }, { level: 'high' }, { level: 'other' }],
      correctOrder,
      (x) => x.level,
    ),
    [],
  );
  t.deepEqual(findViolationsInOrder(['high', 'low', 'test', 'medium'], correctOrder), [
    {
      current: {
        index: 1,
        value: 'low',
      },
      previous: {
        index: 0,
        value: 'high',
      },
    },
    {
      current: {
        index: 2,
        value: 'test',
      },
      previous: {
        index: 1,
        value: 'low',
      },
    },
    {
      current: {
        index: 3,
        value: 'medium',
      },
      previous: {
        index: 2,
        value: 'test',
      },
    },
  ]);
});

test('sortAlphabetically(): should sort array by correct order', (t) => {
  const arrayNumbers = ['3000', '3001', 3002];
  sortAlphabetically(arrayNumbers);
  t.deepEqual(arrayNumbers, ['3000', '3001', 3002]);

  const arrayStrings = ['apple2', 'banana', 'apple10'];
  sortAlphabetically(arrayStrings);
  t.deepEqual(arrayStrings, ['apple2', 'apple10', 'banana']);

  const arrayObjects = [
    { name: 'Alice', age: 60 },
    { name: 'Bob', age: 50 },
  ];
  const originalArrayObjects = [...arrayObjects];
  sortAlphabetically(arrayObjects, (user) => user.name);
  t.deepEqual(arrayObjects, [originalArrayObjects[0], originalArrayObjects[1]]);

  sortAlphabetically(arrayObjects, (user) => String(user.age));
  t.deepEqual(arrayObjects, [originalArrayObjects[1], originalArrayObjects[0]]);
});

test('sortByOrder(): should sort array by correct order', (t) => {
  const correctOrder = ['low', 'medium', 'high'];

  const arrayStrings = ['low', 'medium'];
  const originalArrayStrings = [...arrayStrings];
  sortByOrder(arrayStrings, correctOrder);
  t.deepEqual(arrayStrings, originalArrayStrings);

  const arrayObjects = [
    { level: 'low' },
    { level: 'medium' },
    { level: 'high' },
    { level: 'other2' },
    { level: 'other' },
  ];
  const originalArrayObjects = [...arrayObjects];
  sortByOrder(arrayObjects, correctOrder, (x) => x.level);
  t.deepEqual(arrayObjects, originalArrayObjects);

  const arrayUnsorted = ['other2', 'high', 'other', 'low', 'medium'];
  sortByOrder(arrayUnsorted, correctOrder);
  t.deepEqual(arrayUnsorted, ['low', 'medium', 'high', 'other2', 'other']);
});
