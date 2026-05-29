# PRD — TechIndica
## Product Requirements Document

**Versão:** 1.0  
**Data:** Maio de 2026  
**Autor:** Eliveuton Souza  
**Status:** Em desenvolvimento  

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Problema e Oportunidade](#2-problema-e-oportunidade)
3. [Objetivos e Métricas de Sucesso](#3-objetivos-e-métricas-de-sucesso)
4. [Público-Alvo](#4-público-alvo)
5. [Escopo do Produto](#5-escopo-do-produto)
6. [Arquitetura e Stack Técnica](#6-arquitetura-e-stack-técnica)
7. [Banco de Dados](#7-banco-de-dados)
8. [Funcionalidades — Site Público](#8-funcionalidades--site-público)
9. [Funcionalidades — Painel Admin](#9-funcionalidades--painel-admin)
10. [Automação e Integrações](#10-automação-e-integrações)
11. [Fluxo de Dados Completo](#11-fluxo-de-dados-completo)
12. [Edge Functions](#12-edge-functions)
13. [Design e UX](#13-design-e-ux)
14. [SEO e Conteúdo](#14-seo-e-conteúdo)
15. [Requisitos Não-Funcionais](#15-requisitos-não-funcionais)
16. [Variáveis de Ambiente e Secrets](#16-variáveis-de-ambiente-e-secrets)
17. [Fases de Entrega](#17-fases-de-entrega)
18. [Riscos e Mitigações](#18-riscos-e-mitigações)
19. [Fora do Escopo](#19-fora-do-escopo)
20. [Glossário](#20-glossário)

---

## 1. Visão Geral

**TechIndica** é um site de recomendações de produtos de tecnologia baseadas em especificações técnicas e custo-benefício, monetizado exclusivamente por links de afiliado da **Shopee** e do **Mercado Livre**.

O sistema coleta produtos automaticamente via API da Shopee Affiliates, gera análises técnicas com IA (OpenAI GPT-4o), publica as recomendações no site público e registra o link de afiliado do proprietário em cada produto — gerando renda passiva a partir do tráfego orgânico e pago.

Não há loja, carrinho, cadastro de usuários ou transações financeiras no TechIndica. A venda ocorre 100% nas plataformas parceiras.

---

## 2. Problema e Oportunidade

### Problema

O consumidor brasileiro que pesquisa produtos de tecnologia enfrenta três problemas principais:

- **Excesso de opções sem critério técnico:** sites de e-commerce listam centenas de produtos sem comparação objetiva.
- **Conteúdo genérico:** sites de recomendação existentes (Coompare, MyBest, TechInter) publicam prós e contras superficiais sem especificações reais.
- **Falta de confiança:** o consumidor não sabe se a recomendação é legítima ou apenas patrocinada.

### Oportunidade

Existe espaço para um site que:

- Apresente fichas técnicas reais (tela, processador, bateria, resistência) com linguagem acessível.
- Explique **por que** determinada especificação importa no uso diário.
- Seja atualizado automaticamente com novos produtos e preços.
- Gere renda passiva recorrente para o proprietário via comissão de afiliado.

### Modelo de receita

| Plataforma | Comissão média | Tipo |
|---|---|---|
| Shopee Affiliates | 3% – 12% por venda | CPS (custo por venda) |
| Mercado Livre Afiliados | 2% – 8% por venda | CPS |

---

## 3. Objetivos e Métricas de Sucesso

### Objetivos

1. Publicar ao menos 50 recomendações de produtos nos primeiros 30 dias.
2. Gerar tráfego orgânico via SEO com artigos de recomendação indexáveis.
3. Converter visitantes em cliques nos links de afiliado.
4. Automatizar coleta, geração de copy e publicação sem intervenção manual diária.

### KPIs

| Métrica | Meta (90 dias) |
|---|---|
| Produtos publicados | ≥ 100 |
| Visitas mensais | ≥ 5.000 |
| CTR médio (clique no link afiliado) | ≥ 8% |
| Receita mensal de afiliado | ≥ R$ 500 |
| Tempo médio de geração por produto | ≤ 30 segundos |

---

## 4. Público-Alvo

### Persona primária — "O pesquisador antes de comprar"

- **Perfil:** 22–40 anos, classe B/C, usa smartphone Android.
- **Comportamento:** pesquisa no Google antes de comprar qualquer produto acima de R$ 100.
- **Dor:** passa horas comparando produtos sem encontrar uma comparação técnica clara.
- **Ganho esperado:** chegar a uma decisão de compra confiante em menos de 5 minutos.

### Persona secundária — "O presenteador"

- **Perfil:** 30–55 anos, procura presente de tecnologia para filhos ou cônjuge.
- **Comportamento:** busca "melhor smartwatch até R$ 500" no Google.
- **Dor:** não entende as especificações e não sabe em quem confiar.
- **Ganho esperado:** uma recomendação clara com faixa de preço e onde comprar.

---

## 5. Escopo do Produto

### Categorias de produtos (MVP)

| Slug | Nome | Prioridade |
|---|---|---|
| `smartwatches` | Smartwatches | P0 |
| `fones` | Fones de Ouvido | P0 |
| `notebooks` | Notebooks | P1 |
| `monitores` | Monitores | P1 |
| `tablets` | Tablets | P2 |
| `smartphones` | Smartphones | P2 |

### Funcionalidades MVP (obrigatórias)

- [ ] Site público com homepage, listagem por categoria e página individual de produto
- [ ] Ficha técnica em tabela por produto
- [ ] Seção de prós e contras gerada por IA
- [ ] Botões de afiliado (Shopee + Mercado Livre)
- [ ] Painel admin com autenticação simples
- [ ] Dashboard de credenciais (Shopee API)
- [ ] Execução manual de busca de produtos
- [ ] Geração de copy por IA (OpenAI GPT-4o) por produto
- [ ] Publicação/despublicação de produtos pelo admin
- [ ] Log de execuções

### Funcionalidades pós-MVP (roadmap)

- [ ] Integração com Mercado Livre Afiliados (scraping ou API oficial)
- [ ] Agendamento automático via pg_cron (execução diária)
- [ ] Comparador lado a lado de dois produtos
- [ ] Página de busca por texto
- [ ] Newsletter de ofertas (integração com Resend ou Mailchimp)
- [ ] Sitemap.xml dinâmico para SEO
- [ ] Suporte a múltiplos usuários admin

---

## 6. Arquitetura e Stack Técnica

```
┌─────────────────────────────────────────────────┐
│                  FRONTEND (Lovable)              │
│          React + TypeScript + shadcn/ui          │
│                  Tailwind CSS                    │
│   Site público  │  Painel Admin (/admin/*)       │
└────────────────────────┬────────────────────────┘
                         │ Supabase JS Client
                         ▼
┌─────────────────────────────────────────────────┐
│               SUPABASE                          │
│  PostgreSQL  │  Auth  │  Edge Functions (Deno)  │
│  Storage     │  Realtime  │  pg_cron            │
└──────┬──────────────────────────────┬───────────┘
       │                              │
       ▼                              ▼
┌─────────────┐              ┌────────────────────┐
│  Shopee     │              │  OpenAI API        │
│  Affiliates │              │  GPT-4o            │
│  API        │              │  (copy + análise)  │
└─────────────┘              └────────────────────┘
```

### Decisões de stack

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Frontend | React + Lovable | Geração visual rápida, integração Supabase nativa |
| UI | shadcn/ui + Tailwind | Componentes acessíveis sem overhead |
| Backend | Supabase Edge Functions (Deno) | Serverless, mesma plataforma, sem servidor separado |
| Banco | Supabase PostgreSQL | JSONB para specs, RLS para segurança |
| IA | OpenAI GPT-4o | Melhor qualidade de copy em português BR |
| Afiliados | Shopee Affiliates GraphQL API | API oficial com autenticação HMAC-SHA1 |
| Agendamento | Supabase pg_cron | Elimina n8n da infraestrutura |

---

## 7. Banco de Dados

### Tabela `produtos`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | bigserial PK | ID interno |
| `plataforma` | text | `shopee` ou `mercadolivre` |
| `platform_id` | text UNIQUE | ID do produto na plataforma origem |
| `nome` | text | Nome completo do produto |
| `descricao_curta` | text | Resumo gerado por IA (máx 120 chars) |
| `preco_atual` | numeric | Preço atual em R$ |
| `preco_original` | numeric | Preço antes do desconto |
| `desconto_pct` | int | Percentual de desconto calculado |
| `link_shopee` | text | Link de afiliado Shopee |
| `link_mercadolivre` | text | Link de afiliado ML (futuro) |
| `imagem_url` | text | URL da imagem do produto |
| `categoria` | text | Slug da categoria |
| `specs` | jsonb | Ficha técnica chave/valor |
| `copy_gerada` | text | Texto de recomendação gerado por IA |
| `pros` | jsonb | Array de strings com pontos positivos |
| `contras` | jsonb | Array de strings com pontos negativos |
| `nota` | numeric | Nota de 0 a 10 gerada por IA |
| `badge` | text | Ex: "Melhor custo-benefício" |
| `publicado` | boolean | Visível no site público |
| `destaque` | boolean | Aparece na homepage |
| `created_at` | timestamptz | Data de inserção |
| `updated_at` | timestamptz | Última atualização |

### Tabela `affiliate_config`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | bigserial PK | ID interno |
| `plataforma` | text UNIQUE | `shopee` ou `mercadolivre` |
| `config` | jsonb | Objeto com credenciais (app_id, secret, tracking_id, etc.) |
| `ativo` | boolean | Se a integração está ativa |
| `updated_at` | timestamptz | Última atualização |

### Tabela `execucoes_log`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | bigserial PK | ID interno |
| `plataforma` | text | Origem da execução |
| `status` | text | `success`, `error`, `partial` |
| `produtos_encontrados` | int | Total retornado pela API |
| `produtos_publicados` | int | Total com copy gerada e publicado |
| `erro` | text | Mensagem de erro (se houver) |
| `created_at` | timestamptz | Timestamp da execução |

### Tabela `categorias`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | bigserial PK | ID interno |
| `slug` | text UNIQUE | Identificador de URL (`smartwatches`) |
| `nome` | text | Nome exibido (`Smartwatches`) |
| `icone` | text | Nome do ícone Lucide |
| `ordem` | int | Ordem de exibição no menu |

---

## 8. Funcionalidades — Site Público

### 8.1 Homepage `/`

**Objetivo:** converter visitante em leitor engajado e clicador de afiliado.

**Seções obrigatórias:**

1. **Header fixo**
   - Logo "TechIndica"
   - Navegação por categorias (horizontal, scroll em mobile)
   - Sem login visível para o visitante

2. **Hero**
   - Título principal: "As melhores compras de tecnologia em [ano]"
   - Subtítulo: proposta de valor — recomendações técnicas honestas
   - Badge: "Atualizado em [data atual]"

3. **Grid de categorias**
   - Ícone + nome de cada categoria
   - Clique leva para `/categoria/:slug`

4. **Produtos em destaque**
   - Grid 3 colunas (2 em mobile)
   - Apenas `destaque = true` e `publicado = true`
   - Componente `ProductCard`

5. **Seção por categoria**
   - Top 3 de cada categoria
   - Botão "Ver todos" → `/categoria/:slug`

6. **Footer**
   - Disclaimer de afiliado
   - Links de categorias
   - "© 2026 TechIndica"

### 8.2 Listagem por categoria `/categoria/:slug`

- Busca produtos onde `categoria = slug` e `publicado = true`
- Ordenação padrão: por `nota` decrescente
- Filtros: plataforma, faixa de preço (slider), ordem
- Cards com posição (#1, #2...) e badge
- Paginação: 10 produtos por página

### 8.3 Página de produto `/produto/:id`

**Layout de artigo — estrutura obrigatória:**

1. **Breadcrumb:** Home > [Categoria] > [Nome]
2. **Header do produto:**
   - Imagem (400px, lazy load)
   - Nome completo
   - Badge colorido
   - Nota (ex: 9.2 / 10)
   - Preço original riscado + preço atual
   - Badge de desconto (% em verde)
   - Botões de compra (Shopee laranja + ML amarelo)
3. **"Por que recomendamos":** `copy_gerada` em parágrafos
4. **Ficha Técnica:** tabela com `specs` (chave / valor)
5. **Prós e Contras:** duas colunas, `pros[]` e `contras[]`
6. **CTA final:** botões grandes repetidos com texto "Comprar com o melhor preço"
7. **Disclaimer de afiliado:** rodapé do artigo

### 8.4 Componente `ProductCard`

Props recebidas: `produto`, `posicao`, `showSpecs`

Elementos:
- Número de posição (#1, #2...)
- Badge (cor muda por tipo: azul=geral, verde=custo-benefício, roxo=editor's pick)
- Imagem com lazy load e fallback
- Nome truncado em 2 linhas
- Nota / 10
- `descricao_curta`
- Preço original riscado + preço atual em azul
- % de desconto em badge verde
- Botão "Ver na Shopee" (laranja)
- Botão "Ver no Mercado Livre" (amarelo, desabilitado se sem link)
- Link "Ver análise completa" → `/produto/:id`

### 8.5 Componente `BuyButtons`

Props: `link_shopee`, `link_mercadolivre`, `tamanho`

- Ambos abrem em `_blank` com `rel="noopener noreferrer"`
- Registra evento de clique no console (futuro: analytics)
- Shopee: `#f05d23` background, texto branco
- ML: `#fff159` background, texto `#333`
- Se link ausente: botão desabilitado com tooltip "Em breve"

### 8.6 Componente `AffiliateDisclosure`

Texto fixo:
> "Este site contém links de afiliado. Ao comprar por eles, recebemos uma pequena comissão sem custo adicional para você. Nossas recomendações são baseadas em análise técnica independente de acordos comerciais."

Exibição: caixa cinza claro, ícone de info, fonte 12px, presente no header e no rodapé de cada página de produto.

---

## 9. Funcionalidades — Painel Admin

Rota base: `/admin/*`  
Proteção: variável de ambiente `VITE_ADMIN_PASSWORD` verificada via localStorage (MVP). Auth Supabase no pós-MVP.

### 9.1 Dashboard `/admin`

Cards de resumo (atualizam em tempo real via Supabase Realtime):

| Card | Dado |
|---|---|
| Total de produtos | `count(produtos)` |
| Publicados | `count(produtos where publicado=true)` |
| Sem copy | `count(produtos where copy_gerada is null)` |
| Última execução | `max(created_at) from execucoes_log` |

Gráfico de linha: produtos adicionados por dia (últimos 30 dias).

Atalhos rápidos: "Buscar Shopee agora", "Gerar copies pendentes", "Ver produtos".

### 9.2 Configurações `/admin/config`

**Aba Shopee:**

| Campo | Tipo | Obrigatório |
|---|---|---|
| App ID | text | Sim |
| Secret Key | password (mascarado) | Sim |
| Tracking ID | text | Sim |
| Ativo | toggle | Sim |

Ações:
- "Salvar" → upsert em `affiliate_config` onde `plataforma = 'shopee'`
- "Testar conexão" → chama edge function `shopee-fetch` com limite 1 produto, exibe resultado
- Status badge: verde "Configurado" / vermelho "Não configurado" / amarelo "Não testado"

**Aba Mercado Livre** (placeholder MVP):
- Campos desabilitados com label "Em breve"
- Badge cinza "Não disponível"

### 9.3 Produtos `/admin/produtos`

**Tabela com colunas:**

| Coluna | Comportamento |
|---|---|
| Imagem | Thumbnail 48px com fallback |
| Nome | Truncado, clicável → `/produto/:id` |
| Plataforma | Badge Shopee/ML |
| Categoria | Select editável inline |
| Preço atual | Formatado R$ |
| Desconto | Badge colorido |
| Nota | Stars ou número |
| Publicado | Toggle (atualiza instantaneamente) |
| Destaque | Toggle |
| Ações | "Gerar copy", "Ver", "Excluir" |

**Filtros:**
- Plataforma (Shopee / ML / Todos)
- Categoria (select com categorias)
- Status (Publicado / Rascunho / Sem copy)
- Busca por nome (debounce 300ms)

**Ação "Gerar copy":**
1. Botão vira spinner com texto "Gerando..."
2. Chama edge function `generate-copy` com `produto_id`
3. Ao concluir: atualiza linha na tabela sem reload
4. Se erro: toast vermelho com mensagem

**Exclusão:** modal de confirmação antes de deletar.

### 9.4 Automação `/admin/automacao`

**Cards de plataforma:**

```
┌─────────────────────────────┐
│ 🟠 Shopee                   │
│ Última execução: há 2h      │
│ Produtos encontrados: 18    │
│ Status: ✅ Sucesso           │
│                             │
│ [Buscar agora]              │
└─────────────────────────────┘
```

**Fluxo do botão "Buscar agora":**
1. Botão desabilitado + spinner
2. Progress steps visíveis:
   - "Conectando à API Shopee..."
   - "X produtos encontrados"
   - "Salvando no banco..."
   - "Concluído! X novos produtos."
3. Tabela de execuções atualiza

**Geração em lote:**
- Input numérico: quantidade de produtos para processar (1–50)
- Botão "Gerar copies" → loop sequencial com delay de 2s entre chamadas
- Progress bar com contador "3 / 10 concluídos"
- Log em tempo real dos produtos processados

**Histórico de execuções:**
- Tabela com últimas 20 execuções
- Colunas: data/hora, plataforma, status, encontrados, publicados, erro

---

## 10. Automação e Integrações

### 10.1 Shopee Affiliates API

**Endpoint:** `https://open-api.affiliate.shopee.com.br/graphql`  
**Autenticação:** HMAC-SHA1

**Geração da assinatura:**
```
payload    = app_id + timestamp (unix seconds)
signature  = HMAC-SHA1(secret, payload) → hex string
header     = "SHA1 appid={app_id},timestamp={timestamp},sign={signature}"
```

**Query GraphQL utilizada:**
```graphql
{
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
}
```

**Normalização de preços:**
- Shopee retorna preços em micros (dividir por 100.000)
- Desconto calculado: `round((priceMax - priceMin) / priceMax * 100)`

**Link de afiliado:**
```
{productLink}?smtt=0.0.9&af_sub1={tracking_id}
```

### 10.2 OpenAI GPT-4o

**Endpoint:** `https://api.openai.com/v1/chat/completions`  
**Modelo:** `gpt-4o`  
**response_format:** `{ type: "json_object" }`

**System prompt resumido:**
> Você é especialista em recomendações técnicas de produtos para um site de afiliados brasileiro. Analise o produto e retorne JSON com: categoria, descricao_curta, copy_gerada (3-4 parágrafos honestos em PT-BR), badge, nota (0-10), pros (array), contras (array), specs (objeto chave/valor). Seja técnico, honesto e não invente especificações.

**Campos retornados no JSON:**

```json
{
  "categoria": "smartwatches",
  "descricao_curta": "18 dias de bateria e GPS integrado por menos de R$ 300.",
  "copy_gerada": "Parágrafos de recomendação...",
  "badge": "Melhor custo-benefício",
  "nota": 8.4,
  "pros": ["18 dias de bateria", "GPS integrado", "Tela AMOLED 2\""],
  "contras": ["Sem NFC", "Carregador proprietário"],
  "specs": {
    "Tela": "AMOLED 2.0\" 390×450 px",
    "Bateria": "470 mAh — até 18 dias",
    "GPS": "GPS + GLONASS",
    "Resistência": "5 ATM",
    "Conectividade": "Bluetooth 5.3",
    "Compatibilidade": "Android 6+ / iOS 12+"
  }
}
```

**Custo estimado por produto:** ~0,01 USD (GPT-4o input/output médio)

---

## 11. Fluxo de Dados Completo

```
[Admin clica "Buscar agora"]
        │
        ▼
[Edge Function: shopee-fetch]
  1. Lê credenciais de affiliate_config
  2. Gera assinatura HMAC-SHA1
  3. Chama API GraphQL Shopee
  4. Normaliza preços e filtra inválidos
  5. Upsert em produtos (platform_id como chave)
  6. Insere em execucoes_log
  7. Retorna { ok: true, encontrados: N }
        │
        ▼
[Admin vê produtos na tabela — publicado: false, sem copy]
        │
        ▼
[Admin clica "Gerar copy" em um produto]
        │
        ▼
[Edge Function: generate-copy]
  1. Busca produto por id
  2. Monta prompt com nome, preço, desconto
  3. Chama OpenAI GPT-4o com response_format json
  4. Parseia JSON retornado
  5. Update em produtos:
     - categoria, descricao_curta, copy_gerada
     - badge, nota, pros, contras, specs
     - publicado: true
  6. Retorna { ok: true }
        │
        ▼
[Produto aparece no site público automaticamente]
        │
        ▼
[Visitante acessa /produto/:id]
  - Lê produto do Supabase
  - Clica em botão de afiliado
  - Redireciona para Shopee/ML com link rastreado
  - Compra realizada → comissão registrada na plataforma
```

---

## 12. Edge Functions

### `shopee-fetch`

| Item | Detalhe |
|---|---|
| Trigger | HTTP POST (chamada manual pelo admin ou pg_cron) |
| Input | Nenhum (lê config do banco) |
| Output | `{ ok: boolean, encontrados: number, erro?: string }` |
| Env vars | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| Timeout | 30s |

### `generate-copy`

| Item | Detalhe |
|---|---|
| Trigger | HTTP POST com `{ produto_id: number }` |
| Input | ID do produto na tabela `produtos` |
| Output | `{ ok: boolean, gerado: object }` |
| Env vars | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY` |
| Timeout | 60s |
| Rate limit | 1 chamada por produto, delay de 2s entre lote |

### `generate-copy-batch` (pós-MVP)

| Item | Detalhe |
|---|---|
| Trigger | HTTP POST com `{ quantidade: number }` |
| Input | Número de produtos sem copy para processar |
| Output | Stream de progresso via Server-Sent Events |
| Obs | Processa em sequência com 2s de intervalo |

---

## 13. Design e UX

### Identidade visual

| Elemento | Valor |
|---|---|
| Fonte títulos | Sora (Google Fonts) — pesos 600, 700 |
| Fonte corpo | DM Sans (Google Fonts) — pesos 400, 500 |
| Cor primária | `#2563eb` (azul) |
| Cor Shopee | `#f05d23` (laranja) |
| Cor ML | `#fff159` / texto `#333` (amarelo) |
| Background | `#f9fafb` (cinza muito claro) |
| Cards | Branco `#ffffff`, borda `1px solid #e5e7eb` |
| Raio de borda | 12px cards, 8px botões, 99px badges |

### Badges de produto

| Badge | Cor de fundo | Cor de texto |
|---|---|---|
| Melhor geral / #1 | `#1e40af` | `#dbeafe` |
| Melhor custo-benefício | `#713f12` | `#fef3c7` |
| Editor's Pick | `#4c1d95` | `#ede9fe` |
| Para iOS / Para Android | `#065f46` | `#d1fae5` |
| Mais vendido | `#7f1d1d` | `#fee2e2` |

### Responsividade

| Breakpoint | Layout |
|---|---|
| Mobile < 768px | 1 coluna, cards empilhados, nav colapsado |
| Tablet 768–1024px | 2 colunas |
| Desktop > 1024px | 3 colunas, sidebar opcional |

### Acessibilidade

- `alt` em todas as imagens de produto
- Botões com `aria-label` descritivo
- Links externos com `rel="noopener noreferrer"`
- Contraste mínimo 4.5:1 em todos os textos
- `AffiliateDisclosure` visível em todas as páginas com produtos

---

## 14. SEO e Conteúdo

### Estrutura de URLs

```
/                                → Homepage
/categoria/smartwatches          → Listagem smartwatches
/categoria/notebooks             → Listagem notebooks
/produto/42                      → Página do produto ID 42
/admin                           → Admin (não indexado)
```

### Meta tags por página

**Homepage:**
```html
<title>TechIndica — As melhores compras de tecnologia em 2026</title>
<meta name="description" content="Recomendações técnicas honestas de smartwatches, notebooks, monitores e mais. Atualizadas mensalmente com especificações reais e preços.">
```

**Categoria:**
```html
<title>Top 10 Smartwatches para comprar em 2026 — TechIndica</title>
<meta name="description" content="Os melhores smartwatches avaliados por especificações técnicas reais. Veja ficha técnica, prós, contras e onde comprar pelo menor preço.">
```

**Produto:**
```html
<title>{nome do produto} — Vale a pena? Análise completa | TechIndica</title>
<meta name="description" content="{descricao_curta} Veja a ficha técnica completa, prós e contras e compare preços na Shopee e Mercado Livre.">
```

### Robots

```
/admin/* → noindex, nofollow
/* → index, follow
```

---

## 15. Requisitos Não-Funcionais

### Performance

| Requisito | Meta |
|---|---|
| LCP (Largest Contentful Paint) | < 2.5s |
| Imagens de produto | Lazy load + WebP quando disponível |
| Paginação | 10 itens por página, sem scroll infinito no MVP |
| Edge functions | Timeout máximo 60s (generate-copy) |

### Segurança

| Item | Implementação |
|---|---|
| Credenciais Shopee | Armazenadas em `affiliate_config` no banco, nunca no frontend |
| OpenAI API Key | Somente em Supabase Secrets (env das edge functions) |
| Admin route | Protegida por senha via env var no MVP |
| RLS Supabase | Leitura pública em `produtos` (publicado=true), escrita apenas service role |
| Links afiliados | Abertos em `_blank` com `noopener noreferrer` |

### Disponibilidade

- Supabase free tier: 500MB banco, 500k edge function invocations/mês
- Lovable hosting: incluído no plano
- SLA esperado: 99.5% (dependente da Supabase)

---

## 16. Variáveis de Ambiente e Secrets

### Frontend (Lovable — VITE_*)

| Variável | Onde usar | Descrição |
|---|---|---|
| `VITE_SUPABASE_URL` | Cliente Supabase | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Cliente Supabase | Chave anônima pública |
| `VITE_ADMIN_PASSWORD` | Rota /admin | Senha simples MVP |

### Edge Functions (Supabase Secrets)

| Variável | Onde usar | Descrição |
|---|---|---|
| `SUPABASE_URL` | Todas as functions | URL do projeto (injetada automaticamente) |
| `SUPABASE_SERVICE_ROLE_KEY` | Todas as functions | Chave de service role (bypass RLS) |
| `OPENAI_API_KEY` | `generate-copy` | Chave da OpenAI (nunca exposta no frontend) |

> **Importante:** A `OPENAI_API_KEY` nunca deve ser referenciada em código que roda no navegador. Toda chamada à OpenAI ocorre exclusivamente dentro das Edge Functions no servidor Supabase.

---

## 17. Fases de Entrega

### Fase 1 — Fundação (Semana 1–2)

- [ ] Setup do projeto no Lovable com Supabase conectado
- [ ] Schema do banco criado e seed de categorias
- [ ] Componentes base: `ProductCard`, `BuyButtons`, `AffiliateDisclosure`
- [ ] Homepage estática com dados mock
- [ ] Página `/produto/:id` com layout completo

### Fase 2 — Admin e Integração Shopee (Semana 2–3)

- [ ] Rota `/admin` com proteção por senha
- [ ] Página `/admin/config` com formulário de credenciais Shopee
- [ ] Edge function `shopee-fetch` funcionando
- [ ] Botão "Buscar agora" e log de execuções
- [ ] Página `/admin/produtos` com tabela e toggles

### Fase 3 — IA e Publicação (Semana 3–4)

- [ ] Edge function `generate-copy` funcionando
- [ ] Botão "Gerar copy" por produto no admin
- [ ] Geração em lote com progress bar
- [ ] Site público exibindo produtos reais vindos da Shopee
- [ ] Ficha técnica, prós/contras e copy gerados por IA visíveis

### Fase 4 — Polimento e SEO (Semana 4–5)

- [ ] Meta tags dinâmicas por página
- [ ] Responsividade mobile completa
- [ ] Filtros e ordenação na listagem de categoria
- [ ] Paginação
- [ ] Disclaimer de afiliado em todas as páginas
- [ ] Favicon e og:image padrão

### Fase 5 — Pós-MVP (Semana 6+)

- [ ] Agendamento automático via pg_cron
- [ ] Integração Mercado Livre Afiliados
- [ ] Comparador de produtos
- [ ] Sitemap.xml dinâmico
- [ ] Analytics (Plausible ou Google Analytics 4)

---

## 18. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| API Shopee retorna produtos irrelevantes (vestuário, alimentos) | Alta | Médio | Filtrar por categoria na query ou no normalizar pós-fetch |
| OpenAI inventa especificações técnicas | Média | Alto | Prompt instrui a não inventar specs + revisão manual antes de publicar |
| Custo OpenAI maior que esperado | Baixa | Médio | Rate limiting na geração em lote + monitorar uso no dashboard OpenAI |
| Link de afiliado expirado | Média | Alto | Reprocessar links periodicamente via edge function de validação |
| Shopee API muda estrutura GraphQL | Baixa | Alto | Versionar a query e manter log de erros detalhado |
| Supabase free tier excede limites | Baixa | Médio | Monitorar uso; upgrade para Pro (USD 25/mês) se necessário |

---

## 19. Fora do Escopo

Os itens abaixo **não fazem parte** do produto e não devem ser implementados nesta versão:

- Sistema de cadastro ou login de usuários visitantes
- Carrinho de compras ou checkout próprio
- Pagamentos diretos no TechIndica
- Chat ou suporte ao cliente
- Sistema de avaliações de usuários
- Programa de pontos ou fidelidade
- App mobile nativo (iOS/Android)
- Integração com redes sociais para publicação automática
- Sistema de newsletter (pós-MVP)
- Multi-idioma (apenas PT-BR)

---

## 20. Glossário

| Termo | Definição |
|---|---|
| **Afiliado** | Modelo de negócio onde o TechIndica recebe comissão por cada venda gerada via seu link rastreado |
| **CPS** | Cost Per Sale — comissão paga apenas quando a venda é concluída |
| **Copy** | Texto de recomendação/persuasão gerado pela IA para cada produto |
| **Edge Function** | Função serverless executada no servidor Supabase (Deno runtime), sem exposição no frontend |
| **HMAC-SHA1** | Algoritmo de autenticação usado pela API Shopee para verificar a identidade do requisitante |
| **Tracking ID** | Identificador único do afiliado inserido no link para rastrear cliques e vendas na Shopee |
| **platform_id** | ID único do produto dentro da plataforma de origem (Shopee item ID) |
| **Specs** | Especificações técnicas do produto armazenadas como JSONB (chave: valor) |
| **Destaque** | Flag booleana que indica se o produto aparece na seção de destaques da homepage |
| **RLS** | Row Level Security — política de segurança do Supabase que controla quem pode ler/escrever cada linha |
| **pg_cron** | Extensão do PostgreSQL que permite agendar execuções periódicas de funções SQL |
| **Lovable** | Plataforma de geração de código React com deploy integrado |

---

*Documento gerado em maio de 2026. Versão 1.0.*  
*Próxima revisão prevista: após conclusão da Fase 3.*
