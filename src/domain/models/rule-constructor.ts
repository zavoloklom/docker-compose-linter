import type { Rule, RuleType } from './rule';

type RuleConstructor = {
  new (options?: Record<string, unknown>): Rule;
  ID: string;
  TYPE: RuleType;
};

// eslint-disable-next-line id-length
const isRuleConstructor = (x: unknown): x is RuleConstructor => {
  if (typeof x !== 'function') return false;

  // Check for expected static data
  const hasStaticId = 'ID' in x && typeof x.ID === 'string';
  const hasStaticType = 'TYPE' in x && typeof x.TYPE === 'string';

  // Check instance API on the prototype without creating
  const proto = (x as { prototype?: unknown }).prototype;
  if (typeof proto !== 'object' || proto === null) return false;

  // Check for methods
  const record = proto as Record<string, unknown>;
  const hasCheckMethod = typeof record.check === 'function';
  const hasGetMessageMethod = typeof record.getMessage === 'function';

  return hasStaticId && hasStaticType && hasCheckMethod && hasGetMessageMethod;
};

export { type RuleConstructor, isRuleConstructor };
