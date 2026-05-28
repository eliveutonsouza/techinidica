import OpenAI from 'openai';
import {
  GenerateCopyOutputSchema,
  CuratedPostOutputSchema,
  type GenerateCopyOutput,
  type CuratedPostOutput,
} from '@/schemas';

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (_client) return _client;
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY nao configurada');
  _client = new OpenAI({ apiKey: key });
  return _client;
}

const SYSTEM_PROMPT = `Voce e um redator especialista em produtos de tecnologia para o site TechIndica.
Dado o nome e o preco de um produto, retorne um JSON com:
- categoria: uma das ["smartwatches","fones","notebooks","monitores","tablets","smartphones"]
- descricao_curta: 1 frase (max 90 caracteres) que resume o produto
- copy_gerada: 2-3 paragrafos explicando POR QUE recomendar este produto, voz amigavel mas tecnica em portugues brasileiro
- badge: um dos ["best","value","editor","ios","android","popular"] que melhor representa o produto
- nota: numero de 0 a 10 (use 1 casa decimal, ex 8.4)
- pros: array de 3-5 strings com pontos positivos
- contras: array de 2-4 strings com pontos negativos/limitacoes
- specs: objeto com 4-6 pares chave-valor de specs tecnicas relevantes (ex {"Bateria":"24h","Resistencia":"5ATM"})

Responda APENAS o JSON, sem markdown. Use linguagem natural em portugues brasileiro.`;

export async function generateProductCopy(input: {
  nome: string;
  preco_atual: number;
  plataforma: string;
}): Promise<GenerateCopyOutput> {
  const client = getClient();
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Produto: ${input.nome}\nPreco atual: R$ ${input.preco_atual.toFixed(2)}\nPlataforma: ${input.plataforma}`,
      },
    ],
    temperature: 0.7,
  });
  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('OpenAI retornou conteudo vazio');
  const json = JSON.parse(content);
  return GenerateCopyOutputSchema.parse(json);
}

const CURATOR_SYSTEM = `Voce e um curador editorial do site TechIndica, especialista em recomendar produtos de tecnologia para o publico brasileiro.

Vou te entregar um POOL de produtos da Shopee (com nome, preco, comissao, avaliacao, vendas). Sua tarefa:

1. ESCOLHA um angulo editorial INTERESSANTE e DIVERSIFICADO. Exemplos de angulos:
   - "Top 7 smartphones com melhor custo-beneficio"
   - "5 fones bluetooth premium para quem trabalha de casa"
   - "Smartwatches mais vendidos da semana"
   - "Os melhores notebooks gamer ate R$ 5.000"
   - "Tablets perfeitos para estudantes"
   Pense como um editor: o angulo precisa ser util, especifico e gerar cliques sem ser clickbait barato.

2. SELECIONE entre 5 e 10 produtos do pool que combinam com esse angulo. Misture criterios — nao escolha so os mais vendidos OU so os mais bem avaliados. Use seu julgamento de curador.

3. ESCREVA o post completo em portugues brasileiro, voz amigavel-tecnica:
   - titulo: chamativo, max 140 chars
   - subtitulo: complemento curto (opcional)
   - intro: 2-3 paragrafos contextualizando o angulo (min 40 chars)
   - itens: lista ordenada (1..N), cada um com titulo_item, resumo (1-2 frases), destaque (1 ponto forte). Use o platform_id EXATO do pool.
   - conclusao: paragrafo final com chamada para acao

Retorne APENAS JSON. NAO inclua markdown. NAO invente platform_id — use os do pool.

Estrutura JSON esperada:
{
  "slug": "kebab-case-do-titulo",
  "titulo": "...",
  "subtitulo": "..." | null,
  "intro": "...",
  "conclusao": "...",
  "angulo": "frase curta descrevendo o angulo editorial",
  "categoria": "smartwatches" | "fones" | "notebooks" | "monitores" | "tablets" | "smartphones" | null,
  "itens": [
    { "platform_id": "...", "posicao": 1, "titulo_item": "...", "resumo": "...", "destaque": "..." }
  ]
}`;

export async function generateCuratedPost(
  pool: Array<{
    platform_id: string;
    nome: string;
    preco_atual: number;
    rating: number;
    sales: number;
    commission_rate: number;
  }>,
): Promise<CuratedPostOutput> {
  const client = getClient();
  const userPayload = pool.map((p) => ({
    platform_id: p.platform_id,
    nome: p.nome,
    preco_brl: p.preco_atual,
    rating: p.rating,
    vendas: p.sales,
    comissao_pct: Math.round(p.commission_rate * 100) / 100,
  }));
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: CURATOR_SYSTEM },
      { role: 'user', content: `POOL DE PRODUTOS:\n${JSON.stringify(userPayload, null, 2)}` },
    ],
    temperature: 0.85,
  });
  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('OpenAI retornou conteudo vazio');
  const json = JSON.parse(content);
  return CuratedPostOutputSchema.parse(json);
}
