import OpenAI from "openai";

// Lazy-loaded singleton
let openaiClient: OpenAI | undefined;

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("❌ OPENAI_API_KEY is not set in environment");
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey });
  }

  return openaiClient;
}

export async function callLLM({
  prompt,
  model,
  temperature = 0.7,
  stream = false,
  functions,
}: {
  prompt: string;
  model: string;
  temperature?: number;
  stream?: boolean;
  functions?: any;
}): Promise<any> {
  const client = getOpenAIClient();

  const res = await client.chat.completions.create({
    model,
    temperature,
    stream,
    messages: [{ role: "user", content: prompt }],
    ...(functions ? { functions } : {}),
  });

  if (stream) return res;

  if ("choices" in res && res.choices.length > 0) {
    return res.choices[0].message?.content ?? null;
  }

  return null;
}

export async function* callLLMStream({
  model,
  prompt,
  temperature = 0.7,
}: {
  model: string;
  prompt: string;
  temperature?: number;
}): AsyncGenerator<string> {
  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      prompt,
      temperature,
      max_tokens: 500,
      stream: true,
    }),
  });

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No stream reader found");

  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    yield decoder.decode(value);
  }
}
