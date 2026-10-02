import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { addNote, clearNotes, countNotes, listNotes } from '../api/notes-store.js';
import { createConfirmation } from './confirm.js';
import { run } from './result.js';

/**
 * Un dominio de ejemplo que recorre la escalera de riesgo entera:
 *   list_notes  → solo lectura
 *   add_note    → aditivo (no destruye nada)
 *   clear_notes → irreversible: dos fases + prompt humano obligatorio
 * Sustituye "notas" por tu dominio y conserva la forma.
 */
export function registerNotes(server: McpServer): void {
  server.registerTool(
    'list_notes',
    {
      title: 'Listar notas',
      description: 'Devuelve todas las notas con su id, texto y fecha. No tiene efectos.',
      inputSchema: {},
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async () => run(() => listNotes()),
  );

  server.registerTool(
    'add_note',
    {
      title: 'Añadir una nota',
      description: 'Crea una nota nueva y devuelve su id. No modifica notas existentes.',
      inputSchema: { text: z.string().min(1).max(2000).describe('Texto de la nota') },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ text }) => run(() => addNote(text)),
  );

  const confirmClear = createConfirmation<{ expected: number }>();

  server.registerTool(
    'clear_notes',
    {
      title: 'Borrar todas las notas (dos fases)',
      description:
        'Borra TODAS las notas, en dos pasos obligatorios. SIN `confirmation_token` no borra nada: devuelve ' +
        'cuantas notas se borrarian y un token que caduca en 5 minutos. Solo una segunda llamada CON ese ' +
        'token borra. No tiene vuelta atras.',
      inputSchema: {
        confirmation_token: z
          .string()
          .optional()
          .describe('Token devuelto por la primera fase. Solo pasalo si el humano ha dicho que si'),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: false,
      },
      // Claude Code (>= 2.1.199) muestra el prompt de permiso en CADA llamada, incluso en modo auto.
      _meta: { 'anthropic/requiresUserInteraction': true },
    },
    async ({ confirmation_token }) =>
      run(async () => {
        if (confirmation_token) {
          const { expected } = confirmClear.claim(confirmation_token);
          const deleted = await clearNotes();
          return { borrado: true, notas: deleted, previstas: expected };
        }
        const expected = await countNotes();
        return {
          borrado: false,
          aviso: 'NADA SE HA BORRADO. Enseña esto al humano y espera su visto bueno explicito.',
          se_borrarian: expected,
          confirmation_token: confirmClear.stash({ expected }),
          caduca_en: '5 minutos',
        };
      }),
  );
}
