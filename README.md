# TechIndica

Site de recomendacoes de produtos de tecnologia, monetizado por links de afiliado
Shopee e Mercado Livre. **Next.js 15 (App Router) + Supabase + Zod + Server
Actions**, com integracao Shopee Affiliates (HMAC-SHA1) e geracao de copy via
OpenAI GPT-4o. Pronto pra deploy na Vercel.

## Stack

- **Next.js 15** (App Router, Server Actions, RSC)
- **TypeScript** com `strict: true`
- **Supabase** (PostgreSQL + RLS) — `@supabase/ssr` no server, service_role para mutacoes
- **Zod** para validacao e tipagem em todo o projeto
- **iron-session** (cookie httpOnly) para auth do admin
- **OpenAI GPT-4o** para geracao de copy, badge, nota, pros, contras e specs
- **Vitest** para testes
- Fontes Sora + DM Sans + JetBrains Mono via Google Fonts

## Setup

### 1. Instalar dependencias

```bash
npm install
```

### 2. Criar projeto Supabase

Acesse https://supabase.com/dashboard e crie um novo projeto. No Dashboard:

1. Abra **SQL Editor** e cole o conteudo de `supabase/migrations/0001_initial.sql`.
   Execute. Isso cria as tabelas `produtos`, `categorias`, `affiliate_config`,
   `execucoes_log`, com RLS configurada e seed das 6 categorias.
2. Em **Settings > API**, copie:
   - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` -> `SUPABASE_SERVICE_ROLE_KEY` (**nunca exponha no client**)

### 3. Configurar `.env.local`

```bash
cp .env.example .env.local
# preencha NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# SUPABASE_SERVICE_ROLE_KEY, ADMIN_PASSWORD, SESSION_SECRET, OPENAI_API_KEY,
# SHOPEE_APP_ID, SHOPEE_SECRET.
```

Gere um `SESSION_SECRET` aleatorio com no minimo 32 caracteres:

```bash
openssl rand -base64 32
```

### 4. Rodar localmente

```bash
npm run dev         # http://localhost:3000
npm run typecheck   # tsc --noEmit
npm test            # vitest
npm run build       # bundle de producao
```

## Estrutura

```
src/
  app/
    layout.tsx                  Root layout, fontes, metadata
    page.tsx                    Home (SSR: destaques + recentes + categorias)
    categoria/[slug]/page.tsx   Lista por categoria
    produto/[id]/page.tsx       Pagina do produto (SEO com generateMetadata)
    admin/
      login/                    Auth (cookie httpOnly via iron-session)
      page.tsx                  Dashboard (KPIs + log de execucoes)
      produtos/                 Tabela CRUD + filtros + geracao de copy
      automacao/                Coleta Shopee + historico
      config/                   Credenciais Shopee
    not-found.tsx
  actions/                      Server Actions (`'use server'`)
    auth.ts                     login/logout
    products.ts                 togglePublicado, toggleDestaque, deleteProduto
    shopee-fetch.ts             runShopeeFetch — HMAC-SHA1 + upsert + log
    generate-copy.ts            generateCopyForProduto, generateCopyBulk
    config.ts                   saveShopeeConfig, testShopeeConnection
  components/
    ui/                         Icon, ProductBadge, Card, estilos
    product/                    ProductCard, ProductImage, BuyButtons, AffiliateDisclosure
    public/                     PublicHeader, PublicFooter
    admin/                      AdminShell, LogoutButton
  lib/
    supabase/
      client.ts                 createBrowserClient (uso no client)
      server.ts                 createServerClient (cookies, RSC/Action)
      admin.ts                  service_role (bypass RLS) — server-only
    auth.ts                     getSession, requireAuth (iron-session)
    shopee.ts                   buildShopeeAuthHeader, normalizePrice, buildAffiliateLink, fetchShopeeProducts
    openai.ts                   generateProductCopy (GPT-4o, JSON mode + Zod parse)
  schemas/index.ts              **Toda** a tipagem Zod do projeto
  middleware.ts                 Protege /admin/* (redirect para /admin/login se sem sessao)
  __tests__/                    Vitest: schemas, shopee, auth
supabase/migrations/
  0001_initial.sql              Schema + RLS + seed das categorias
```

## Rotas

- `/` — homepage (destaques + recentes + categorias)
- `/categoria/[slug]` — listagem por categoria
- `/produto/[id]` — pagina do produto
- `/admin/login` — login (cookie de sessao httpOnly)
- `/admin` — dashboard
- `/admin/produtos` — tabela com toggles, filtros, geracao de copy
- `/admin/automacao` — disparar coleta Shopee + historico
- `/admin/config` — credenciais Shopee (salvas em `affiliate_config`)

## Seguranca

- `SUPABASE_SERVICE_ROLE_KEY` so e usado em Server Actions (`lib/supabase/admin.ts`).
- `OPENAI_API_KEY`, `SHOPEE_SECRET`, `ADMIN_PASSWORD` ficam server-side.
- RLS ativa em `produtos` (publico le apenas `publicado = true`), `affiliate_config`,
  `execucoes_log` e `categorias` (publico le todas). `service_role` faz bypass.
- Cookie de sessao do admin: `httpOnly`, `sameSite: lax`, `secure` em producao.
- Senha do admin (`ADMIN_PASSWORD`) so e comparada no server.
- Links de afiliado tem `rel="nofollow sponsored noopener"`.

## Deploy (Vercel)

1. Push para o GitHub.
2. Em vercel.com, importe o repo.
3. Configure as variaveis de ambiente do `.env.example`.
4. Deploy.

## Funcionalidades MVP implementadas

- [x] Schema Supabase com RLS e seed
- [x] Auth admin via cookie httpOnly (`iron-session`)
- [x] Middleware protegendo `/admin/*`
- [x] Public pages SSR (home, categoria, produto, post) com SEO
- [x] Admin CRUD de produtos: toggle publicado/destaque, excluir
- [x] Coleta Shopee (HMAC-SHA1, GraphQL, normalizacao de precos)
- [x] Geracao de copy GPT-4o (JSON mode + Zod parse) — single e bulk
- [x] **Posts curados pela IA**: pool diverso (mais vendidos + melhor avaliados + maior comissao), GPT-4o escolhe angulo editorial e escreve 5-10 itens
- [x] **Agendamento `pg_cron`** disparando `/api/cron/generate-post` diariamente
- [x] Logs de execucao em `execucoes_log`
- [x] Validacao Zod em **toda** entrada (forms, API responses, DB rows)
- [x] Testes unitarios (Vitest): 22 testes cobrindo HMAC, normalizacao, schemas

## Geracao automatica de posts curados

Fluxo (cron diario ou disparo manual em `/admin/automacao`):

1. Le credenciais Shopee da tabela `affiliate_config`
2. `fetchShopeePool()` chama 3 buckets em paralelo: `sortType=2` (vendas), `sortType=3` (rating), `sortType=4` (comissao); deduplica por `itemId`
3. Upsert dos produtos em `produtos`
4. `generateCuratedPost()` envia o pool ao GPT-4o, que escolhe um angulo editorial diversificado (ex "Top smartphones custo-beneficio", "Fones premium para home office"), seleciona 5-10 produtos e escreve titulo, intro, item por item e conclusao
5. Persiste em `posts`, gera slug unico, publica e revalida rotas

Agendamento via `supabase/migrations/0003_pg_cron.sql` (edite `EDITAR-SITE-URL` e `EDITAR-CRON-SECRET` antes de aplicar). Teste manual:

```bash
curl -X POST "https://seu-site.com/api/cron/generate-post" \
  -H "Authorization: Bearer $CRON_SECRET"
```

## Pos-MVP (nao implementado)

- Mercado Livre Afiliados
- Sentry / observabilidade
- Newsletter
