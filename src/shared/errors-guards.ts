/* eslint-disable no-undefined */

// Narrow to plain object (not null, not array/function)
const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

// Safe check that value looks like an Error
const isError = (error: unknown): error is Error => {
  if (error instanceof Error) return true;
  if (!isRecord(error)) return false;
  return typeof error.name === 'string' && typeof error.message === 'string';
};

// Best-effort runtime guard for ErrnoException
const isErrnoException = (error: unknown): error is NodeJS.ErrnoException => {
  if (!isRecord(error)) return false;

  const code = error.code;
  const message = error.message;
  const name = error.name;

  // Required
  const hasCode = typeof code === 'string' || typeof code === 'number';
  const hasMessage = typeof message === 'string';
  const hasName = typeof name === 'string';

  if (!(hasCode && hasMessage && hasName)) return false;

  // Optional-but-typical fields: if present, must have correct types
  const isErrnoCorrectType = error.errno === undefined || typeof error.errno === 'number';
  const isPathCorrectType = error.path === undefined || typeof error.path === 'string';
  const isSyscallCorrectType = error.syscall === undefined || typeof error.syscall === 'string';
  const isStackCorrectType = error.stack === undefined || typeof error.stack === 'string';

  return isErrnoCorrectType && isPathCorrectType && isSyscallCorrectType && isStackCorrectType;
};

export { isError, isErrnoException };
