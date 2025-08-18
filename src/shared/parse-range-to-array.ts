const parseRangeToArray = (range: string): string[] => {
  const [start, end] = range.split('-').map(Number);

  if (Number.isNaN(start) || Number.isNaN(end)) return [];

  if (!end) return [start.toString()];

  // Invalid range: start is greater than end
  if (start > end) return [];

  // Creates an array of strings with numbers from start to end (inclusive)
  return Array.from({ length: end - start + 1 }, (value, index) => String(start + index));
};

export { parseRangeToArray };
