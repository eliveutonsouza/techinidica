import { describe, it, expect } from 'vitest';
import {
  ProdutoSchema,
  CategoriaSchema,
  LoginSchema,
  SaveShopeeConfigSchema,
  GenerateCopyOutputSchema,
  ShopeeProductNodeSchema,
  ShopeeResponseSchema,
} from '@/schemas';

describe('ProdutoSchema', () => {
  it('parses a valid produto with defaults', () => {
    const result = ProdutoSchema.safeParse({
      id: 1,
      plataforma: 'shopee',
      platform_id: 'shop_123',
      nome: 'Echo Dot',
      descricao_curta: null,
      preco_atual: '99.90',
      preco_original: null,
      desconto_pct: 0,
      link_shopee: null,
      link_mercadolivre: null,
      imagem_url: null,
      categoria: null,
      specs: {},
      copy_gerada: null,
      pros: [],
      contras: [],
      nota: null,
      badge: null,
      publicado: false,
      destaque: false,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.preco_atual).toBe(99.9);
    }
  });

  it('rejects an invalid plataforma', () => {
    const result = ProdutoSchema.safeParse({
      id: 1,
      plataforma: 'amazon',
      platform_id: 'x',
      nome: 'x',
      descricao_curta: null,
      preco_atual: 0,
      preco_original: null,
      desconto_pct: 0,
      link_shopee: null,
      link_mercadolivre: null,
      imagem_url: null,
      categoria: null,
      copy_gerada: null,
      nota: null,
      badge: null,
      publicado: false,
      destaque: false,
      created_at: 'x',
      updated_at: 'x',
    });
    expect(result.success).toBe(false);
  });
});

describe('CategoriaSchema', () => {
  it('parses a valid categoria', () => {
    const result = CategoriaSchema.safeParse({
      id: 1,
      slug: 'fones',
      nome: 'Fones',
      icone: 'headphones',
      ordem: 1,
    });
    expect(result.success).toBe(true);
  });
});

describe('LoginSchema', () => {
  it('rejects empty password', () => {
    expect(LoginSchema.safeParse({ password: '' }).success).toBe(false);
  });
  it('accepts non-empty password', () => {
    expect(LoginSchema.safeParse({ password: 'x' }).success).toBe(true);
  });
});

describe('SaveShopeeConfigSchema', () => {
  it('requires all string fields', () => {
    expect(
      SaveShopeeConfigSchema.safeParse({ app_id: '', secret: 's', tracking_id: 't', ativo: true }).success,
    ).toBe(false);
  });
  it('accepts a valid payload', () => {
    expect(
      SaveShopeeConfigSchema.safeParse({
        app_id: '123',
        secret: 'sec',
        tracking_id: 'main',
        ativo: true,
      }).success,
    ).toBe(true);
  });
});

describe('GenerateCopyOutputSchema', () => {
  it('parses a valid GPT-4o response', () => {
    const r = GenerateCopyOutputSchema.safeParse({
      categoria: 'fones',
      descricao_curta: 'curto',
      copy_gerada: 'texto',
      badge: 'value',
      nota: 8.5,
      pros: ['boa bateria'],
      contras: ['sem ANC'],
      specs: { Bateria: '24h' },
    });
    expect(r.success).toBe(true);
  });

  it('rejects bad badge', () => {
    const r = GenerateCopyOutputSchema.safeParse({
      categoria: 'fones',
      descricao_curta: 'curto',
      copy_gerada: 'texto',
      badge: 'awesome',
      nota: 8.5,
      pros: ['a'],
      contras: ['b'],
      specs: {},
    });
    expect(r.success).toBe(false);
  });

  it('rejects nota out of range', () => {
    const r = GenerateCopyOutputSchema.safeParse({
      categoria: 'fones',
      descricao_curta: 'c',
      copy_gerada: 't',
      badge: 'value',
      nota: 11,
      pros: ['a'],
      contras: ['b'],
      specs: {},
    });
    expect(r.success).toBe(false);
  });
});

describe('ShopeeProductNodeSchema', () => {
  it('coerces numeric itemId to string', () => {
    const r = ShopeeProductNodeSchema.safeParse({
      itemId: 12345,
      productName: 'x',
      priceMax: 1000000,
      priceMin: 900000,
      commissionRate: 0.05,
      shopName: 'shop',
      imageUrl: 'https://x.com/x.jpg',
      productLink: 'https://shopee.com.br/item/123',
      ratingStar: 4.5,
      sales: 100,
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.itemId).toBe('12345');
  });
});

describe('ShopeeResponseSchema', () => {
  it('parses a real-shape response', () => {
    const r = ShopeeResponseSchema.safeParse({
      data: {
        productOfferV2: {
          nodes: [
            {
              itemId: '1',
              productName: 'p',
              priceMax: 1000000,
              priceMin: 800000,
              commissionRate: 0.05,
              shopName: 's',
              imageUrl: 'https://x.com/i.jpg',
              productLink: 'https://shopee.com.br/x',
              ratingStar: 4,
              sales: 10,
            },
          ],
        },
      },
    });
    expect(r.success).toBe(true);
  });
});
