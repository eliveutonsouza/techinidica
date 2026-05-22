# TechIndica

Site de recomendações técnicas de produtos de tecnologia, monetizado por links
de afiliado (Shopee e Mercado Livre). Frontend React + Vite + TypeScript,
roteamento por hash (sem React Router) e mock data — backend Supabase e
integrações Shopee Affiliates / OpenAI virão no próximo milestone.

## Stack

- React 18 + TypeScript
- Vite 5
- Estilo inline (preservado do design original); fontes Sora + DM Sans + JetBrains Mono via Google Fonts

## Scripts

```bash
npm install
npm run dev         # vite dev server em :5173
npm run build       # bundle de produção em dist/
npm run preview     # serve dist/ localmente
npm run typecheck   # tsc -b (apenas verificação, build não depende)
```

## Estrutura

```
src/
  main.tsx           Entry: importa módulos na ordem de dependência
  data.ts            Mock de categorias, produtos, badges, logs de execução
  ui.tsx             Primitives: Icon, Badge, Tooltip, Modal, Toast, ProductCard…
  public-shell.tsx   Header e Footer do site público
  public-pages.tsx   Home, Categoria, Produto
  admin-shell.tsx    Login, Shell, Dashboard do admin
  admin-pages.tsx    Config, Produtos, Automação
  app.tsx            Router por hash + render do Root
```

## Rotas

- `/` — homepage
- `/#/categoria/:slug` — listagem (smartwatches, fones, notebooks, monitores, tablets, smartphones)
- `/#/produto/:id` — página do produto
- `/#/admin/login` — admin (senhas demo: `demo`, `admin`, `1234`)
- `/#/admin`, `/#/admin/produtos`, `/#/admin/automacao`, `/#/admin/config`

O botão "Mapa do protótipo" no canto inferior esquerdo é navegação de demo
e não existe em produção.

## Próximos passos (do PRD)

- Migrar mock para Supabase (`produtos`, `affiliate_config`, `execucoes_log`, `categorias`)
- Edge Functions Deno: `shopee-fetch` (HMAC-SHA1) e `generate-copy` (OpenAI GPT-4o)
- Auth do admin via Supabase em vez de senha no localStorage
- pg_cron para coleta diária automática
