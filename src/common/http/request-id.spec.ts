import { describe, expect, it } from 'vitest';
import {
  generateRequestId,
  isSafeRequestId,
  resolveRequestId,
  sanitizeRequestUrl,
} from './request-id.js';

describe('isSafeRequestId', () => {
  it.each(['abc', 'req_1234', 'a.b_c:d-e', 'A'.repeat(128)])(
    'accepts %s',
    (value) => {
      expect(isSafeRequestId(value)).toBe(true);
    },
  );

  it.each([
    '',
    'has spaces',
    'has/slash',
    'A'.repeat(129),
    undefined,
    null,
    123,
    {},
  ])('rejects %s', (value) => {
    expect(isSafeRequestId(value)).toBe(false);
  });
});

describe('resolveRequestId', () => {
  it('reuses a safe incoming request id', () => {
    const generate = () => 'generated';

    expect(resolveRequestId('incoming-id', generate)).toBe('incoming-id');
  });

  it('generates a new id when the incoming value is unsafe', () => {
    const generate = () => 'generated';

    expect(resolveRequestId('not a valid id', generate)).toBe('generated');
    expect(resolveRequestId(undefined, generate)).toBe('generated');
  });
});

describe('generateRequestId', () => {
  it('returns a prefixed UUID', () => {
    expect(generateRequestId()).toMatch(
      /^req_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });
});

describe('sanitizeRequestUrl', () => {
  it('removes the query string', () => {
    expect(sanitizeRequestUrl('/api/v1/users?page=2&token=secret')).toBe(
      '/api/v1/users',
    );
  });

  it('preserves urls without a query string', () => {
    expect(sanitizeRequestUrl('/healthz')).toBe('/healthz');
  });

  it('preserves empty values', () => {
    expect(sanitizeRequestUrl(undefined)).toBeUndefined();
    expect(sanitizeRequestUrl('')).toBe('');
  });
});
