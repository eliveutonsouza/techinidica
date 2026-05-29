import { describe, it, expect } from 'vitest';
import crypto from 'node:crypto';
import { buildShopeeAuthHeader, normalizePrice, buildAffiliateLink } from '@/lib/shopee';

describe('buildShopeeAuthHeader', () => {
  it('produces SHA256(appId+timestamp+body+secret) signature', () => {
    const appId = 'app123';
    const secret = 'super-secret';
    const body = '{"query":"{ test }"}';
    const timestamp = 1700000000;
    const header = buildShopeeAuthHeader(appId, secret, body, timestamp);

    const expectedSign = crypto
      .createHash('sha256')
      .update(`${appId}${timestamp}${body}${secret}`)
      .digest('hex');

    expect(header).toBe(`SHA256 Credential=${appId}, Timestamp=${timestamp}, Signature=${expectedSign}`);
  });

  it('produces a deterministic header for the same inputs', () => {
    const a = buildShopeeAuthHeader('a', 'b', 'body', 1);
    const b = buildShopeeAuthHeader('a', 'b', 'body', 1);
    expect(a).toBe(b);
  });

  it('produces different signs for different secrets', () => {
    const a = buildShopeeAuthHeader('app', 'secret1', 'body', 100);
    const b = buildShopeeAuthHeader('app', 'secret2', 'body', 100);
    expect(a).not.toBe(b);
  });
});

describe('normalizePrice', () => {
  it('converts micros to currency with 2 decimals', () => {
    expect(normalizePrice(12_990_000)).toBe(129.9);
    expect(normalizePrice(99_900_000)).toBe(999);
  });

  it('rounds correctly', () => {
    expect(normalizePrice(123_456)).toBe(1.23);
  });

  it('handles zero', () => {
    expect(normalizePrice(0)).toBe(0);
  });
});

describe('buildAffiliateLink', () => {
  it('appends af_sub1 and smtt to the product link', () => {
    const url = buildAffiliateLink('https://shopee.com.br/item/123', 'techindica_main');
    expect(url).toContain('af_sub1=techindica_main');
    expect(url).toContain('smtt=0.0.9');
  });

  it('preserves existing query params', () => {
    const url = buildAffiliateLink('https://shopee.com.br/item/123?foo=bar', 'tid');
    expect(url).toContain('foo=bar');
    expect(url).toContain('af_sub1=tid');
  });
});
