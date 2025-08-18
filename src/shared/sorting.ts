interface OrderViolation {
  current: {
    index: number;
    value: string;
  };
  previous: {
    index: number;
    value: string;
  };
}

const enNaturalCollator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

/**
 * Checks whether an array is sorted alphabetically in English,
 * ignoring case and treating digit substrings as numbers.
 *
 * Notes:
 * - Comparison is case-insensitive (`"A"` equals `"a"`).
 * - Numeric comparison is "natural": `"2"` comes before `"10"`.
 * - By default, each element is converted with `String(value)`.
 *   You can provide a custom `getValue` to extract the string from objects.
 * - Designed for ASCII/English only. For other locales use Intl.Collator with appropriate options.
 *
 * @template T Type of elements in the array.
 * @param {readonly T[]} array - The array to validate.
 * @param {(item: T) => string} [getValue=String] - Function that extracts a string value for comparison.
 * @returns {boolean} `true` if the array is sorted alphabetically, otherwise `false`.
 *
 * @example
 * isSortedAlphabetically(["apple2", "apple10", "banana"]);
 * // true
 *
 * isSortedAlphabetically([10, 2]);
 * // false  (compares as "10" vs "2")
 *
 * type User = { name: string };
 * isSortedAlphabetically([{name: "Alice"}, {name: "Bob"}], u => u.name);
 * // true
 */
const isSortedAlphabetically = <T>(array: readonly T[], getValue: (item: T) => string = String): boolean => {
  if (array.length < 2) return true;
  for (let i = 1; i < array.length; i++) {
    if (enNaturalCollator.compare(getValue(array[i - 1]), getValue(array[i])) > 0) {
      return false;
    }
  }
  return true;
};

/**
 * Checks whether an array is sorted according to a predefined order of keys.
 *
 * Rules:
 * - All items whose keys are listed in `correctOrder` must appear in exactly that order.
 * - Any items with keys not found in `correctOrder` are considered "unknown" and must come
 *   only after all known items. Their relative order is not validated.
 *
 * @template T Type of elements in the array.
 * @param {readonly T[]} array - The array to validate.
 * @param {readonly string[]} correctOrder - Array of keys that defines the required order.
 * @param {(item: T) => string} [getValue=String] - Function that extracts a string value for comparison.
 * @returns {boolean} `true` if the array is sorted according to the rules, otherwise `false`.
 *
 * @example
 * const correctOrder = ["low", "medium", "high"] as const;
 *
 * isSortedByOrder(
 *   [{level: "low"}, {level: "medium"}, {level: "high"}, {level: "other"}],
 *   correctOrder,
 *   x => x.level
 * ); // true
 *
 * isSortedByOrder(
 *   [{level: "medium"}, {level: "low"}],
 *   correctOrder,
 *   x => x.level
 * ); // false
 */
const isSortedByOrder = <T>(
  array: readonly T[],
  correctOrder: readonly string[],
  getValue: (item: T) => string = String,
): boolean => {
  if (array.length < 2) return true;

  const rankMap = new Map<string, number>(correctOrder.map((key, index) => [key, index]));
  const unknownRank = correctOrder.length;

  let previousRank = -1;
  for (const element of array) {
    const key = getValue(element);
    const rankValue = rankMap.has(key) ? rankMap.get(key)! : unknownRank;

    if (rankValue < previousRank) {
      return false;
    }
    previousRank = rankValue;
  }
  return true;
};

/**
 * Checks whether the element at the given index is in correct alphabetical order
 * relative to its previous element.
 *
 * Rules:
 * - The first element (index 0) is always considered valid.
 * - Case-insensitive.
 * - Numeric substrings are compared as numbers ("2" < "10").
 * - Only the previous element is considered for validation.
 *
 * @template T
 * @param {readonly T[]} array - The array containing the element.
 * @param {number} index - Index of the element to validate.
 * @param {(item: T) => string} [getValue=String] - Extracts a string for comparison.
 * @returns {boolean} `true` if the element is in a valid alphabetical position, otherwise `false`.
 */
const isElementInAlphabeticalOrder = <T>(
  array: readonly T[],
  index: number,
  getValue: (item: T) => string = String,
): boolean => {
  if (index <= 0 || index >= array.length) return true;

  const previous = getValue(array[index - 1]);
  const current = getValue(array[index]);

  return enNaturalCollator.compare(previous, current) <= 0;
};

/**
 * Checks whether the element at the given index is in correct position
 * according to the predefined sequence of keys.
 *
 * Rules:
 * - All known keys must follow the order in `correctOrder`.
 * - Unknown keys are allowed only after all known ones.
 * - Only the previous neighbor is considered for validation.
 *
 * @template T
 * @param {readonly T[]} array - The array containing the element.
 * @param {readonly string[]} correctOrder - Array of keys that defines the required order.
 * @param {number} index - Index of the element to validate.
 * @param {(item: T) => string} [getValue=String] - Extracts a key from an element.
 * @returns {boolean} `true` if the element is in a valid order, otherwise `false`.
 */
const isElementInOrder = <T>(
  array: readonly T[],
  correctOrder: readonly string[],
  index: number,
  getValue: (item: T) => string = String,
): boolean => {
  if (index < 0 || index >= array.length) return true;

  const rankMap = new Map<string, number>(correctOrder.map((key, keyIndex) => [key, keyIndex]));
  const unknownRank = correctOrder.length;

  const currentKey = getValue(array[index]);
  const currentRank = rankMap.has(currentKey) ? rankMap.get(currentKey)! : unknownRank;

  if (index > 0) {
    const previousKey = getValue(array[index - 1]);
    const previousRank = rankMap.has(previousKey) ? rankMap.get(previousKey)! : unknownRank;
    if (currentRank < previousRank) return false;
  }
  return true;
};

/**
 * Finds adjacent violations in an array where elements are expected
 * to be in alphabetical order.
 *
 * Rules:
 * - Elements are compared using a natural collator (`enNaturalCollator`).
 * - If the value of the previous element is greater than the current one,
 *   the pair is reported as a violation.
 * - Returns an array of violations, each containing the previous and current element.
 *
 * @template T Type of elements in the array.
 * @param {readonly T[]} array - The array to check.
 * @param {(item: T) => string} [getValue=String] - Function to extract a string value for comparison.
 * @returns {OrderViolation[]} Array of violations found. Empty if array is in order.
 *
 * @example
 * findViolationsInAlphabeticalOrder(["apple", "banana", "carrot"]); // []
 * findViolationsInAlphabeticalOrder(["banana", "apple"]);
 * // => [{ previous: {index:0,item:"banana",value:"banana"}, current: {index:1,item:"apple",value:"apple"} }]
 */
const findViolationsInAlphabeticalOrder = <T>(
  array: readonly T[],
  getValue: (item: T) => string = String,
): OrderViolation[] => {
  const violations: OrderViolation[] = [];
  if (array.length < 2) return violations;
  const values = array.map((element) => getValue(element));
  for (let i = 1; i < array.length; i++) {
    if (enNaturalCollator.compare(values[i - 1], values[i]) > 0) {
      violations.push({
        current: {
          index: i,
          value: values[i],
        },
        previous: {
          index: i - 1,
          value: values[i - 1],
        },
      });
    }
  }
  return violations;
};

/**
 * Finds adjacent violations in an array where elements are expected
 * to follow a predefined order of keys.
 *
 * Rules:
 * - Keys listed in `correctOrder` must appear in exactly that order.
 * - A violation is also reported if an "unknown" item appears before the last known item.
 * - Items with keys not found in `correctOrder` are treated as "unknown"
 *   and must come only after all known items. Their relative order is not validated.
 * - Returns an array of violations, each containing the previous and current element.
 *
 * @template T Type of elements in the array.
 * @param {readonly T[]} array - The array to check.
 * @param {readonly string[]} correctOrder - The allowed order of keys.
 * @param {(item: T) => string} [getValue=String] - Function to extract the key string from an element.
 * @returns {OrderViolation[]} Array of violations found. Empty if array is in order.
 *
 * @example
 * const correctOrder = ["low", "medium", "high"] as const;
 *
 * findViolationsInOrder(
 *   [{level:"low"}, {level:"medium"}, {level:"high"}],
 *   correctOrder,
 *   x => x.level
 * ); // []
 *
 * findViolationsInOrder(
 *   [{level:"medium"}, {level:"low"}],
 *   correctOrder,
 *   x => x.level
 * );
 * // => [{ previous: {index:0,item:{level:"medium"},value:"medium"},
 * //       current: {index:1,item:{level:"low"},value:"low"} }]
 */
const findViolationsInOrder = <T>(
  array: readonly T[],
  correctOrder: readonly string[],
  getValue: (item: T) => string = String,
): OrderViolation[] => {
  const violations: OrderViolation[] = [];
  if (array.length < 2) return violations;

  const rankMap = new Map<string, number>(correctOrder.map((key, index) => [key, index]));
  const unknownRank = correctOrder.length;

  const values = array.map((element) => getValue(element));
  const ranks = values.map((value) => rankMap.get(value) ?? unknownRank);

  // Find last index of known element
  let lastKnownIndex = -1;
  for (let i = array.length - 1; i >= 0; i--) {
    if (ranks[i] !== unknownRank) {
      lastKnownIndex = i;
      break;
    }
  }

  for (let i = 1; i < array.length; i++) {
    const previousRank = ranks[i - 1];
    const currentRank = ranks[i];

    // Check with previous
    if (previousRank > currentRank) {
      violations.push({
        current: { index: i, value: values[i] },
        previous: { index: i - 1, value: values[i - 1] },
      });
    }

    // Check if this is unknown element
    if (currentRank === unknownRank && i < lastKnownIndex) {
      violations.push({
        current: { index: i, value: values[i] },
        previous: { index: i - 1, value: values[i - 1] },
      });
    }
  }

  return violations;
};

/**
 * Sorts an array alphabetically in English using natural comparison,
 * ignoring case and treating digit substrings as numbers.
 *
 * Rules:
 * - Comparison is case-insensitive ("A" equals "a").
 * - Numeric substrings are compared as numbers ("2" < "10").
 * - By default, each element is converted with `String(value)`.
 *   You can provide a custom `getValue` to extract the string from objects.
 * - Sorting is stable: if two values compare equal, their original order is preserved.
 *
 * @template T Type of elements in the array.
 * @param {readonly T[]} array - The array to sort.
 * @param {(item: T) => string} [getValue=String] - Extracts a string for comparison.
 * @returns {T[]} A new array sorted alphabetically.
 *
 * @example
 * sortAlphabetically(["banana", "Apple2", "Apple10"]);
 * // => ["Apple2", "Apple10", "banana"]
 */
const sortAlphabetically = <T>(array: T[], getValue: (item: T) => string = String): void => {
  array.sort((a, b) => enNaturalCollator.compare(getValue(a), getValue(b)));
};

/**
 * Sorts an array according to a predefined order of keys.
 *
 * Rules:
 * - All items whose keys are listed in `correctOrder` come first, in that order.
 * - Any items with keys not found in `correctOrder` ("unknown") are placed
 *   after all known items, but keep their original relative order.
 * - Sorting is stable: items with the same key preserve their order.
 *
 * @template T Type of elements in the array.
 * @param {readonly T[]} array - The array to sort.
 * @param {readonly string[]} correctOrder - Array of keys that defines the required order.
 * @param {(item: T) => string} [getValue=String] - Extracts a key from an element.
 * @returns {T[]} A new array sorted according to the predefined order.
 *
 * @example
 * const correctOrder = ["low", "medium", "high"] as const;
 * sortByOrder(
 *   [{level:"medium"}, {level:"low"}, {level:"other"}, {level:"high"}],
 *   correctOrder,
 *   x => x.level
 * );
 * // => [{level:"low"}, {level:"medium"}, {level:"high"}, {level:"other"}]
 */
const sortByOrder = <T>(array: T[], correctOrder: readonly string[], getValue: (item: T) => string = String): void => {
  const rankMap = new Map<string, number>(correctOrder.map((key, i) => [key, i]));
  const unknownRank = correctOrder.length;

  array.sort((a, b) => {
    const ra = rankMap.get(getValue(a)) ?? unknownRank;
    const rb = rankMap.get(getValue(b)) ?? unknownRank;
    return ra - rb;
  });
};

export {
  isSortedByOrder,
  isSortedAlphabetically,
  isElementInAlphabeticalOrder,
  isElementInOrder,
  findViolationsInAlphabeticalOrder,
  findViolationsInOrder,
  sortAlphabetically,
  sortByOrder,
};
