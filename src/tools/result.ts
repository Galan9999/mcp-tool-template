import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

export function asText(payload: unknown): CallToolResult {
  const text = typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2);
  return { content: [{ type: 'text', text }] };
}

export function asError(err: unknown): CallToolResult {
  return {
    isError: true,
    content: [{ type: 'text', text: err instanceof Error ? err.message : String(err) }],
  };
}

/**
 * El unico try/catch del proyecto. Un error de negocio se devuelve como `isError: true`
 * con un mensaje que diga que hacer a continuacion: el modelo lo lee y se corrige.
 */
export async function run(fn: () => unknown): Promise<CallToolResult> {
  try {
    return asText(await fn());
  } catch (err) {
    return asError(err);
  }
}
