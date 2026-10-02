import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer } from '../src/server.js';

// Cliente y servidor en el mismo proceso, unidos por un transporte en memoria: pasa por
// serializacion, validacion de esquema y handshake. Es el protocolo de verdad, sin procesos.
const client = new Client({ name: 'test', version: '0.0.0' });
const server = createServer();

beforeAll(async () => {
  const [clientSide, serverSide] = InMemoryTransport.createLinkedPair();
  await server.connect(serverSide);
  await client.connect(clientSide);
});

afterAll(async () => {
  await client.close();
  await server.close();
});

async function call(name: string, args: Record<string, unknown> = {}) {
  const result = await client.callTool({ name, arguments: args });
  const raw = (result.content as { text?: string }[])[0]?.text ?? '';
  const payload: unknown = result.isError ? null : JSON.parse(raw);
  return { isError: Boolean(result.isError), raw, payload };
}

describe('tools/list', () => {
  it('toda herramienta declara readOnlyHint y destructiveHint', async () => {
    const { tools } = await client.listTools();
    expect(tools.length).toBeGreaterThan(0);
    for (const tool of tools) {
      expect(tool.annotations?.readOnlyHint, `${tool.name} sin readOnlyHint`).toBeTypeOf('boolean');
      expect(tool.annotations?.destructiveHint, `${tool.name} sin destructiveHint`).toBeTypeOf('boolean');
      expect(tool.description, `${tool.name} sin description`).toBeTruthy();
    }
  });

  it('lo irreversible exige interaccion humana', async () => {
    const { tools } = await client.listTools();
    const clear = tools.find((t) => t.name === 'clear_notes');
    expect(clear?._meta).toMatchObject({ 'anthropic/requiresUserInteraction': true });
  });
});

describe('escalera de riesgo con el dominio de ejemplo', () => {
  it('ping responde sin efectos', async () => {
    const { isError, payload } = await call('ping', { echo: 'hola' });
    expect(isError).toBe(false);
    expect(payload).toMatchObject({ server: 'mcp-tool-template', echo: 'hola' });
  });

  it('add_note valida y list_notes lo refleja', async () => {
    const empty = await call('add_note', { text: '   ' });
    expect(empty.isError).toBe(true);
    expect(empty.raw).toMatch(/vacia/);

    await call('add_note', { text: 'primera' });
    const { payload } = await call('list_notes');
    expect(payload).toEqual([expect.objectContaining({ text: 'primera' })]);
  });

  it('clear_notes no borra sin token, borra con token y el token se consume', async () => {
    const preview = await call('clear_notes');
    expect(preview.payload).toMatchObject({ borrado: false, se_borrarian: 1 });
    const token = (preview.payload as { confirmation_token: string }).confirmation_token;
    expect(token).toMatch(/^[0-9a-f-]{36}$/);
    expect((await call('list_notes')).payload).toHaveLength(1);

    const done = await call('clear_notes', { confirmation_token: token });
    expect(done.payload).toMatchObject({ borrado: true, notas: 1 });
    expect((await call('list_notes')).payload).toHaveLength(0);

    const again = await call('clear_notes', { confirmation_token: token });
    expect(again.isError).toBe(true);
    expect(again.raw).toMatch(/desconocido/);
  });
});
