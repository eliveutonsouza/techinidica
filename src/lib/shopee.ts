import crypto from 'node:crypto';
import { ShopeeResponseSchema, type ShopeeProductNode } from '@/schemas';

const ENDPOINT = 'https://open-api.affiliate.shopee.com.br/graphql';
const PRICE_DIVISOR = 100_000;

/**
 * SHA256(AppId + Timestamp + Payload + Secret)
 * Ref: https://affiliate.shopee.com.br/open_api/home — Authentication section
 */
export function buildShopeeAuthHeader(
  appId: string,
  secret: string,
  body: string,
  timestamp: number = Math.floor(Date.now() / 1000),
): string {
  const factor = `${appId}${timestamp}${body}${secret}`;
  const sign = crypto.createHash('sha256').update(factor).digest('hex');
  return `SHA256 Credential=${appId}, Timestamp=${timestamp}, Signature=${sign}`;
}

/** Preco Shopee vem em micros (ex: 12990000 = R$ 129,90). Exportado para teste. */
export function normalizePrice(priceMicros: number): number {
  return Math.round((priceMicros / PRICE_DIVISOR) * 100) / 100;
}

/** Adiciona tracking ao link de afiliado. Exportado para teste. */
export function buildAffiliateLink(productLink: string, trackingId: string): string {
  const url = new URL(productLink);
  url.searchParams.set('smtt', '0.0.9');
  url.searchParams.set('af_sub1', trackingId);
  return url.toString();
}

const QUERY = `{
  productOfferV2(listType: 0, limit: 20, sortType: 2) {
    nodes {
      itemId
      productName
      priceMax
      priceMin
      commissionRate
      shopName
      imageUrl
      productLink
      ratingStar
      sales
    }
  }
}`;

function buildPoolQuery(limit: number, sortType: number): string {
  return `{
    productOfferV2(listType: 0, limit: ${limit}, sortType: ${sortType}) {
      nodes {
        itemId
        productName
        priceMax
        priceMin
        commissionRate
        shopName
        imageUrl
        productLink
        ratingStar
        sales
      }
    }
  }`;
}

export type FetchedProduct = {
  platform_id: string;
  nome: string;
  preco_atual: number;
  preco_original: number | null;
  desconto_pct: number;
  imagem_url: string;
  link_shopee: string;
};

async function callShopee(appId: string, secret: string, query: string): Promise<ShopeeProductNode[]> {
  const bodyStr = JSON.stringify({ query });
  const auth = buildShopeeAuthHeader(appId, secret, bodyStr);
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: auth },
    body: bodyStr,
  });
  if (!res.ok) {
    throw new Error(`Shopee API ${res.status}: ${await res.text()}`);
  }
  const json = await res.json();
  if (json.errors) {
    throw new Error(`Shopee GraphQL error: ${JSON.stringify(json.errors)}`);
  }
  const parsed = ShopeeResponseSchema.parse(json);
  return parsed.data.productOfferV2.nodes;
}

function toFetched(n: ShopeeProductNode, trackingId: string): FetchedProduct {
  const priceAtual = normalizePrice(n.priceMin);
  const priceOriginal = n.priceMax !== n.priceMin ? normalizePrice(n.priceMax) : null;
  const desconto = priceOriginal
    ? Math.round(((priceOriginal - priceAtual) / priceOriginal) * 100)
    : 0;
  return {
    platform_id: n.itemId,
    nome: n.productName,
    preco_atual: priceAtual,
    preco_original: priceOriginal,
    desconto_pct: desconto > 0 ? desconto : 0,
    imagem_url: n.imageUrl,
    link_shopee: buildAffiliateLink(n.productLink, trackingId),
  };
}

export async function fetchShopeeProducts(
  appId: string,
  secret: string,
  trackingId: string,
): Promise<FetchedProduct[]> {
  const nodes = await callShopee(appId, secret, QUERY);
  return nodes.map((n) => toFetched(n, trackingId));
}

export type ShopeePoolItem = {
  raw: ShopeeProductNode;
  fetched: FetchedProduct;
};

/**
 * Coleta um pool diverso de produtos combinando diferentes sortTypes da Shopee:
 * 2 = mais vendidos, 3 = melhor avaliados, 4 = maior comissao.
 * Deduplica por itemId. Usado para o curador IA escolher um angulo.
 */
export async function fetchShopeePool(
  appId: string,
  secret: string,
  trackingId: string,
  perBucket: number = 30,
): Promise<ShopeePoolItem[]> {
  const buckets = [2, 3, 4];
  const results = await Promise.all(
    buckets.map((sortType) => callShopee(appId, secret, buildPoolQuery(perBucket, sortType))),
  );
  const seen = new Set<string>();
  const pool: ShopeePoolItem[] = [];
  for (const nodes of results) {
    for (const n of nodes) {
      if (seen.has(n.itemId)) continue;
      seen.add(n.itemId);
      pool.push({ raw: n, fetched: toFetched(n, trackingId) });
    }
  }
  return pool;
}
