/**
 * Capa de "API externa". Aqui es un Map en memoria para que la plantilla funcione sin credenciales;
 * en un proyecto real este modulo (o varios, uno por dominio) envuelve la API de verdad.
 *
 * Reglas de la capa:
 *  - devuelve datos planos; no sabe nada de MCP (ni `content`, ni `isError`)
 *  - lanza Error con un mensaje accionable cuando algo no se puede hacer
 *  - toda llamada repetida pasa por el limitador de ritmo de ./rate-limit.ts
 */
export type Note = { id: string; text: string; created_at: string };

const notes = new Map<string, Note>();
let seq = 0;

export async function listNotes(): Promise<Note[]> {
  return [...notes.values()];
}

export async function addNote(text: string): Promise<Note> {
  const trimmed = text.trim();
  if (!trimmed) throw new Error('La nota esta vacia. Pasa un texto.');
  const note = { id: `note_${++seq}`, text: trimmed, created_at: new Date().toISOString() };
  notes.set(note.id, note);
  return note;
}

export async function countNotes(): Promise<number> {
  return notes.size;
}

export async function clearNotes(): Promise<number> {
  const n = notes.size;
  notes.clear();
  return n;
}
