---
name: new-tool
description: Crea una herramienta MCP nueva de principio a fin con el flujo SDD ligero del proyecto — spec aprobada, test por protocolo que falla, implementación, pnpm check y una llamada real por stdio. Úsala cuando el usuario pida añadir, crear o exponer una herramienta nueva.
---

# Nueva herramienta: `$ARGUMENTS`

Sigue estos pasos en orden. No saltes al código.

## 1. Spec (y parar)

- Lee `docs/SPEC-TEMPLATE.md` y, si existe, una spec ya implementada en `docs/specs/` para copiar el tono.
- Mira `src/tools/` para saber en qué dominio encaja y qué herramientas vecinas existen: la
  `description` debe decir cuándo usar esta y no aquellas.
- Escribe `docs/specs/<nombre>.md` con **todas** las secciones. Decide el peldaño de riesgo y
  justifícalo. Si pide permisos o scopes nuevos, dilo en voz alta.
- **Para aquí** y pide al usuario que apruebe la spec. Sin aprobación explícita no hay código.

## 2. Test que falla

- En `test/<dominio>.test.ts` (crea el fichero si el dominio es nuevo, copiando el arranque de
  `test/server.test.ts`): un caso que compruebe que la herramienta aparece en `tools/list` con
  las anotaciones de la spec, y un caso por cada fila de "Casos de test".
- La API externa se dobla con `vi.mock('../src/api/<dominio>.js', ...)`. Nunca contra la real.
- `pnpm test` debe fallar por la herramienta que falta, no por otra cosa.

## 3. Código

- `src/api/<dominio>.ts`: función que devuelve datos planos y lanza `Error` con el mensaje exacto
  de la tabla de errores de la spec. Llamadas repetidas pasan por `src/api/rate-limit.ts`.
- `src/tools/<dominio>.ts`: `server.registerTool` con `title`, `description` (la primera frase es
  la de la spec), `inputSchema` con `.describe()` en cada campo, las cuatro `annotations`, y
  `_meta: { 'anthropic/requiresUserInteraction': true }` si es irreversible. Handler de 1-3
  líneas con `run(() => ...)`. Irreversible → `createConfirmation`. Masivo → `dry_run: true`.
- Dominio nuevo → `registerX(server)` en `src/server.ts`.

## 4. Verificar

- `pnpm check` verde (formato, lint, build, tests, smoke).
- `pnpm call <nombre> '<json>'` con un caso real de la spec y pega el resultado en la respuesta.
  Si la herramienta es irreversible, llama solo a la primera fase.

## 5. Cerrar

- Fila en la tabla "Herramientas" del `README.md`. Spec → `Estado: implementada`.
- Resume en tres líneas: qué hace, qué peldaño, qué se verificó.
