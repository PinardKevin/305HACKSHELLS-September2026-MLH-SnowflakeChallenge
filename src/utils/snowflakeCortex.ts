/**
 * Snowflake Cortex REST client for MLH Best Use of Snowflake API.
 * OpenAI-compatible chat completions — one account, many hosted LLMs.
 * Docs: https://docs.snowflake.com/en/user-guide/snowflake-cortex/open_ai_sdk
 */
export type CortexMessage = { role: "system" | "user" | "assistant"; content: string };

export function isSnowflakeConfigured(): boolean {
  const account = process.env.SNOWFLAKE_ACCOUNT?.trim();
  const pat = process.env.SNOWFLAKE_PAT?.trim();
  return Boolean(account && pat);
}

export async function cortexComplete(
  messages: CortexMessage[],
  options?: { model?: string }
): Promise<string> {
  const account = process.env.SNOWFLAKE_ACCOUNT?.trim();
  const pat = process.env.SNOWFLAKE_PAT?.trim();
  if (!account || !pat) {
    throw new Error("Snowflake Cortex is not configured (SNOWFLAKE_ACCOUNT / SNOWFLAKE_PAT).");
  }

  const model = options?.model || process.env.SNOWFLAKE_CORTEX_MODEL || "llama3.1-70b";
  const url = `https://${account}.snowflakecomputing.com/api/v2/cortex/v1/chat/completions`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${pat}`,
      Accept: "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.2,
    }),
  });

  const raw = await res.text();
  if (!res.ok) {
    throw new Error(`Snowflake Cortex ${res.status}: ${raw.slice(0, 500)}`);
  }

  let data: any;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("Snowflake Cortex returned non-JSON.");
  }

  const text = data?.choices?.[0]?.message?.content;
  if (!text || typeof text !== "string") {
    throw new Error("Snowflake Cortex response missing choices[0].message.content");
  }
  return text;
}
