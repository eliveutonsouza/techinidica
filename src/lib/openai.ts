import OpenAI from 'openai';
import { GenerateCopyOutputSchema, type GenerateCopyOutput } from '@/schemas';

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
