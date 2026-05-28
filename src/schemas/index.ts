import { z } from 'zod';

// =============================================================================
// Constantes
// =============================================================================
export const PLATAFORMAS = ['shopee', 'mercadolivre'] as const;
export const BADGES = ['best', 'value', 'editor', 'ios', 'android', 'popular'] as const;
export const EXEC_STATUS = ['success', 'error', 'partial'] as const;

// =============================================================================
// Entidades do banco
// =============================================================================
export const CategoriaSchema = z.object({
  id: z.number(),
  slug: z.string(),
  nome: z.string(),
  icone: z.string().nullable(),
  ordem: z.number(),
});

export const ProdutoSchema = z.object({
  id: z.number(),
  plataforma: z.enum(PLATAFORMAS),
  platform_id: z.string(),
  nome: z.string(),
  descricao_curta: z.string().nullable(),
  preco_atual: z.coerce.number(),
  preco_original: z.coerce.number().nullable(),
  desconto_pct: z.number().default(0),
  link_shopee: z.string().nullable(),
  link_mercadolivre: z.string().nullable(),
  imagem_url: z.string().nullable(),
  categoria: z.string().nullable(),
  specs: z.record(z.string()).default({}),
  copy_gerada: z.string().nullable(),
  pros: z.array(z.string()).default([]),
  contras: z.array(z.string()).default([]),
  nota: z.coerce.number().nullable(),
  badge: z.string().nullable(),
  publicado: z.boolean(),
  destaque: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const AffiliateConfigSchema = z.object({
  id: z.number(),
  plataforma: z.string(),
  config: z.record(z.unknown()),
  ativo: z.boolean(),
  updated_at: z.string(),
});

export const ExecucaoLogSchema = z.object({
  id: z.number(),
  plataforma: z.string(),
  status: z.enum(EXEC_STATUS),
  produtos_encontrados: z.number(),
  produtos_publicados: z.number(),
  erro: z.string().nullable(),
  created_at: z.string(),
});

// =============================================================================
// Formularios / inputs de Server Actions
// =============================================================================
export const LoginSchema = z.object({
  password: z.string().min(1, 'Senha obrigatoria'),
});

export const SaveShopeeConfigSchema = z.object({
  app_id: z.string().min(1, 'App ID obrigatorio'),
  secret: z.string().min(1, 'Secret obrigatorio'),
  tracking_id: z.string().min(1, 'Tracking ID obrigatorio'),
  ativo: z.boolean(),
});
export type SaveShopeeConfigInput = z.infer<typeof SaveShopeeConfigSchema>;

export const SaveOpenAIConfigSchema = z.object({
  monthly_limit_usd: z.coerce.number().min(0),
});

export const ToggleProdutoSchema = z.object({
  id: z.coerce.number(),
  value: z.boolean(),
});

export const DeleteProdutoSchema = z.object({
  id: z.coerce.number(),
});

// =============================================================================
// Shopee API
// =============================================================================
export const ShopeeProductNodeSchema = z.object({
  itemId: z.union([z.string(), z.number()]).transform((v) => String(v)),
  productName: z.string(),
  priceMax: z.coerce.number(),
  priceMin: z.coerce.number(),
  commissionRate: z.coerce.number().optional().default(0),
  shopName: z.string().optional().default(''),
  imageUrl: z.string().url(),
  productLink: z.string().url(),
  ratingStar: z.coerce.number().optional().default(0),
  sales: z.coerce.number().optional().default(0),
});
export type ShopeeProductNode = z.infer<typeof ShopeeProductNodeSchema>;

export const ShopeeResponseSchema = z.object({
  data: z.object({
    productOfferV2: z.object({
      nodes: z.array(ShopeeProductNodeSchema),
    }),
  }),
});

// =============================================================================
// OpenAI: estrutura JSON retornada pelo GPT-4o
// =============================================================================
export const GenerateCopyOutputSchema = z.object({
  categoria: z.string(),
  descricao_curta: z.string(),
  copy_gerada: z.string(),
  badge: z.enum(BADGES),
  nota: z.coerce.number().min(0).max(10),
  pros: z.array(z.string()).min(1),
  contras: z.array(z.string()).min(1),
  specs: z.record(z.string()),
});
export type GenerateCopyOutput = z.infer<typeof GenerateCopyOutputSchema>;

// =============================================================================
// Tipos inferidos
// =============================================================================
export type Plataforma = (typeof PLATAFORMAS)[number];
export type Badge = (typeof BADGES)[number];
export type ExecStatus = (typeof EXEC_STATUS)[number];
export type Categoria = z.infer<typeof CategoriaSchema>;
export type Produto = z.infer<typeof ProdutoSchema>;
export type AffiliateConfig = z.infer<typeof AffiliateConfigSchema>;
export type ExecucaoLog = z.infer<typeof ExecucaoLogSchema>;

// =============================================================================
// Resultado padronizado de Server Actions
// =============================================================================
export type ActionResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };
