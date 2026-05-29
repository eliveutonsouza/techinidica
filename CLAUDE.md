# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # dev server — http://localhost:3000
npm run build        # production bundle
npm run typecheck    # tsc --noEmit (run before committing)
npm test             # vitest run (all tests)
npm run test:watch   # vitest watch mode
npm run lint         # next lint
```

Run a single test file:
```bash
npx vitest run src/__tests__/shopee.test.ts
```

## Architecture

**Next.js 15 App Router + Supabase + Zod**. No separate backend — all mutations happen through Server Actions (`src/actions/`).

### Data flow

```
Browser → Server Action → lib/supabase/admin.ts (service_role) → Supabase DB
                       → lib/shopee.ts (HMAC-SHA256) → Shopee GraphQL API
                       → lib/openai.ts (GPT-4o JSON mode) → OpenAI API
```

### Key conventions

**Zod is the single source of truth.** All DB row types, form inputs, and API response shapes live in `src/schemas/index.ts`. Never define types elsewhere — derive them with `z.infer<>`.

**Server Actions return `ActionResult<T>`** (`{ ok: true; data: T } | { ok: false; error: string }`). Every action starts with `requireAuth()` from `src/lib/auth.ts`.

**Three Supabase clients — use the right one:**
- `lib/supabase/client.ts` — browser only (anon key)
- `lib/supabase/server.ts` — RSC/Server Actions (anon key + cookies)
- `lib/supabase/admin.ts` — Server Actions only (service_role, bypasses RLS)

**Admin auth** uses `iron-session` (httpOnly cookie `techindica_admin`). Middleware at `src/middleware.ts` guards `/admin/*`. All admin Server Actions call `requireAuth()` directly — the middleware is an extra layer, not the sole gate.

### AI-generated content — two separate flows

1. **Product copy** (`src/actions/generate-copy.ts`): single product → `generateProductCopy()` → updates `produtos` row with copy, specs, pros, contras, nota, badge.
2. **Curated posts** (`src/actions/generate-post.ts`): fetches a pool from Shopee (3 sort buckets in parallel), GPT-4o picks an editorial angle and selects 5–10 products, persists to `posts` table. Triggered manually or via `/api/cron/generate-post` (Bearer `CRON_SECRET`).

### Shopee integration

`lib/shopee.ts` handles HMAC-SHA256 auth: `payload = app_id + timestamp`, signed with `crypto.createHmac('sha256', secret)`. Prices come back in micros — divide by 100,000. Affiliate link appends `?smtt=0.0.9&af_sub1={tracking_id}`.

## Database

Migrations in `supabase/migrations/`. Apply in SQL Editor on Supabase Dashboard — there is no local Supabase CLI setup.

- `0001_initial.sql` — core tables (`produtos`, `categorias`, `affiliate_config`, `execucoes_log`) + RLS + category seed
- `0002_posts.sql` — `posts` table for AI-curated posts
- `0003_pg_cron.sql` — pg_cron schedule (edit `EDITAR-SITE-URL` and `EDITAR-CRON-SECRET` before applying)

RLS summary: `produtos` public SELECT on `publicado = true`; all writes require `service_role`. `categorias` fully public read. `affiliate_config` and `execucoes_log` require service_role.

## Edge Functions

Funções Deno serverless em `supabase/functions/`. Usam `SUPABASE_SERVICE_ROLE_KEY` injetado automaticamente.

```bash
supabase functions deploy <function-name>   # deploy individual
supabase functions serve <function-name>    # dev local (requer Docker)
supabase functions logs <function-name>     # logs em tempo real
```

Env secrets das Edge Functions (nunca commitar — ficam no Supabase Vault):
```bash
# setar (um ou múltiplos)
supabase secrets set OPENAI_API_KEY=sk-... CRON_SECRET=...

# listar nomes (valores ficam ocultos)
supabase secrets list

# remover
supabase secrets unset OPENAI_API_KEY
```

Secrets necessários para as funções deste projeto:

| Secret | Usado em | Observação |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | todas as functions | injetado automaticamente pelo runtime |
| `OPENAI_API_KEY` | `generate-copy`, `generate-post` | nunca expor no frontend |
| `SHOPEE_APP_ID` | `shopee-fetch` | credencial da API Shopee Affiliates |
| `SHOPEE_SECRET` | `shopee-fetch` | usada no HMAC-SHA256 |
| `SHOPEE_TRACKING_ID` | `shopee-fetch` | afiliado rastreado no link |
| `CRON_SECRET` | `generate-post` (cron trigger) | min 32 chars, Bearer token |

> Fallback MCP: `mcp__claude_ai_Supabase__execute_sql` para inspecionar; deploy via `mcp__claude_ai_Supabase__deploy_edge_function`.

Funções previstas no roadmap (Fase 5+): `shopee-fetch` e `generate-copy` migradas de Server Actions para Edge Functions se latência ou timeout virar problema. Por ora Server Actions são suficientes.

## Prioridade de ferramentas

**Regra:** sempre preferir CLI sobre MCP para economizar tokens.

| Tarefa | Preferir | Fallback |
|---|---|---|
| Supabase (migrations, SQL, logs) | `supabase` CLI | `mcp__claude_ai_Supabase__*` |
| Supabase Edge Functions (deploy, logs) | `supabase functions deploy <name>` | `mcp__claude_ai_Supabase__deploy_edge_function` / `get_edge_function` / `get_logs` |
| Git (status, log, diff, commit) | `git` via Bash | — |
| Linear (criar/atualizar issues) | — | `mcp__claude_ai_Linear__*` |
| Vercel (deploy, logs) | `vercel` CLI | `mcp__claude_ai_Vercel__*` |
| Busca em arquivos | `Grep` / `Glob` tools | — |
| Leitura de arquivos | `Read` tool | — |

---

## Linear — fonte da verdade do projeto

**Projeto:** [TechIndica — Site de Afiliados Tech](https://linear.app/eliveutondev/project/techindica-site-de-afiliados-tech-de4f9880e996)
**Team:** Eliveutondev (ELI) · **Lead:** Eliveuton Melo

### Regra obrigatória para Claude Code

Ao implementar qualquer feature ou fix mapeado abaixo, marcar a issue correspondente como **Done** no Linear via MCP tool `mcp__claude_ai_Linear__save_issue` com `state: "Done"`.

Antes de iniciar qualquer feature, verificar o status atual no Linear com `mcp__claude_ai_Linear__get_issue`.

### Mapa de issues por feature

| Issue | Título | Status |
|---|---|---|
| ELI-271 | Setup Next.js 15 + Supabase conectado | ✅ Done |
| ELI-272 | Schema banco + seed categorias (migration 0001) | ✅ Done |
| ELI-273 | Componentes base: ProductCard, BuyButtons, AffiliateDisclosure | ✅ Done |
| ELI-274 | Homepage — destaques, categorias e produtos recentes | ✅ Done |
| ELI-275 | Página /produto/[id] — layout completo | ✅ Done |
| ELI-276 | Auth admin — iron-session + middleware | ✅ Done |
| ELI-277 | Admin /admin/config — formulário credenciais Shopee | ✅ Done |
| ELI-278 | Server Action shopee-fetch — HMAC-SHA1 + upsert | ✅ Done |
| ELI-279 | Admin /admin/automacao — controles + log execuções | ✅ Done |
| ELI-280 | Admin /admin/produtos — tabela + toggles | ✅ Done |
| ELI-281 | Server Action generate-copy — GPT-4o JSON mode | ✅ Done |
| ELI-282 | Geração de copy em lote com progress bar | ✅ Done |
| ELI-283 | Posts curados por IA — generate-post | ✅ Done |
| ELI-284 | Endpoint cron /api/cron/generate-post | ✅ Done |
| ELI-285 | Listagem por categoria /categoria/[slug] | ✅ Done |
| ELI-286 | Migrations posts (0002) + pg_cron (0003) | ✅ Done |
| ELI-287 | Meta tags dinâmicas — title, description, og:image | ✅ Done |
| ELI-288 | Responsividade mobile completa (< 768px) | ✅ Done |
| ELI-289 | Filtros + ordenação na listagem de categoria | ✅ Done |
| ELI-290 | Paginação na listagem de categoria (10 itens/página) | ✅ Done |
| ELI-291 | AffiliateDisclosure em todas as páginas com produtos | ✅ Done |
| ELI-292 | Favicon + og:image padrão | ✅ Done |
| ELI-293 | Sitemap.xml dinâmico | ✅ Done |
| ELI-294 | Integração Mercado Livre Afiliados | ✅ Done |
| ELI-295 | Comparador de produtos lado a lado | ✅ Done |
| ELI-296 | Página de busca por texto | ✅ Done |
| ELI-297 | Newsletter de ofertas (Resend ou Mailchimp) | ✅ Done |
| ELI-298 | Analytics — Plausible ou Google Analytics 4 | ✅ Done |
| ELI-299 | Suporte a múltiplos usuários admin | ✅ Done |
| ELI-300 | Agendamento automático Shopee via pg_cron | ✅ Done |

### Como marcar uma issue como Done (exemplo)

```
mcp__claude_ai_Linear__save_issue({ id: "ELI-287", state: "Done" })
```

---

## Environment variables

Copy `.env.example` to `.env.local`. Critical ones:

| Variable | Where used |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase clients |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabase/admin.ts` — server only |
| `ADMIN_PASSWORD` | Login Server Action — server only |
| `SESSION_SECRET` | iron-session signing — min 32 chars |
| `OPENAI_API_KEY` | `lib/openai.ts` — server only |
| `SHOPEE_APP_ID` / `SHOPEE_SECRET` / `SHOPEE_TRACKING_ID` | `lib/shopee.ts` — server only |
| `CRON_SECRET` | `/api/cron/generate-post` bearer token |
| `NEXT_PUBLIC_SITE_URL` | Must include protocol (e.g. `https://techinidica.com`) |
