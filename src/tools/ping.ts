import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { SERVER_NAME, SERVER_VERSION } from '../server.js';
import { run } from './result.js';

/** La herramienta minima: solo lectura, mundo cerrado, sin API externa. Util para comprobar que el servidor responde. */
export function registerPing(server: McpServer): void {
  server.registerTool(
    'ping',
    {
      title: 'Comprobar que el servidor responde',
      description:
        'Devuelve nombre, version y hora del servidor. Usala para comprobar que la conexion funciona; no tiene efectos.',
      inputSchema: { echo: z.string().optional().describe('Texto que se devuelve tal cual, para depurar') },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ echo }) =>
      run(() => ({
        server: SERVER_NAME,
        version: SERVER_VERSION,
        time: new Date().toISOString(),
        echo: echo ?? null,
      })),
  );
}
