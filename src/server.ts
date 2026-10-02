import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerNotes } from './tools/notes.js';
import { registerPing } from './tools/ping.js';

export const SERVER_NAME = 'mcp-tool-template';
export const SERVER_VERSION = '0.1.0';

/**
 * Monta el servidor y registra cada dominio. Es una funcion (y no un modulo con efectos)
 * para que los tests puedan crear una instancia y conectarla a un transporte en memoria.
 */
export function createServer(): McpServer {
  const server = new McpServer({ name: SERVER_NAME, version: SERVER_VERSION });
  registerPing(server);
  registerNotes(server);
  return server;
}
