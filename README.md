# mcp-tool-template

Plantilla para crear un servidor MCP en TypeScript que Claude Code pueda usar, con el flujo, las
reglas y la verificación ya montados. Está pensada para una persona que quiere construir
herramientas propias (sobre su correo, su calendario, sus ficheros, una API cualquiera) sin que el
proyecto se degrade al crecer.

Viene con un dominio de ejemplo ("notas", en memoria, sin credenciales) que recorre la escalera de
riesgo completa: una herramienta de solo lectura, una aditiva y una irreversible con confirmación en
dos fases. Sustituye el ejemplo por tu dominio y conserva la forma.

## Crear un proyecto desde la plantilla

```bash
cp -R mcp-tool-template mi-servidor && cd mi-servidor && rm -rf .git node_modules dist
```

Después renombra en tres sitios: `name` y `bin` en `package.json`, `SERVER_NAME` en
`src/server.ts`, y el título de `CLAUDE.md`. Luego:

```bash
pnpm install && pnpm check
```

Si `pnpm check` está verde, ya tienes un servidor que Claude Code puede usar. Regístralo:

```bash
claude mcp add --scope user mi-servidor -- node "$PWD/dist/index.js"
```

## El flujo: SDD ligero

Spec-driven development reducido a lo que de verdad evita errores en un servidor MCP: la `description`
y el schema son lo único que el modelo lee para decidir, así que se escriben **antes** del código y se
aprueban como se aprobaría una API pública.

```
/new-tool nombre
   │
   ├─ 1. Spec de una página     docs/specs/<nombre>.md   ← el humano la aprueba
   ├─ 2. Test que falla         test/<dominio>.test.ts   ← por protocolo, sin API real
   ├─ 3. Código                 src/api/<dominio>.ts + src/tools/<dominio>.ts
   ├─ 4. pnpm check             formato · lint con tipos · build · tests · smoke por stdio
   ├─ 5. pnpm call              una llamada real al binario, como la haría Claude Code
   └─ 6. README                 fila en la tabla de herramientas; spec → "implementada"
```

Las tres skills de `.claude/skills/` guían a Claude Code por este flujo:

| Skill | Para qué |
|---|---|
| `/new-tool <nombre>` | Una herramienta nueva de principio a fin, parando a pedir aprobación de la spec |
| `/new-api <servicio>` | Conectar una API externa real: auth, permisos mínimos, token, cuota, capa `src/api/` |
| `/verify` | Cerrar un cambio: `pnpm check`, llamada real, revisar anotaciones y descripción |

## Comandos

| Comando | Qué hace |
|---|---|
| `pnpm check` | Todo lo de abajo, en orden. Si está verde, el cambio está bien. |
| `pnpm fmt` / `pnpm fmt:check` | Formatea con oxfmt (compatible con Prettier) / solo comprueba |
| `pnpm lint` | oxlint con reglas de tipos (sigue TypeScript 7) |
| `pnpm build` | `tsc` a `dist/` |
| `pnpm test` | vitest; los tests hablan con el servidor por protocolo con `InMemoryTransport` |
| `pnpm smoke` | Lanza `dist/index.js` por stdio, hace `initialize` y `tools/list`, falla si falta alguna anotación |
| `pnpm call <tool> '<json>'` | Llama a una herramienta por stdio y muestra el resultado |
| `pnpm inspect` | Abre el Inspector MCP oficial contra el binario |

## Estructura

```
src/
├── index.ts            arranque stdio (nunca lleva lógica)
├── server.ts           createServer(): registra cada dominio
├── tools/              una fila de la tabla = un fichero por DOMINIO, no por herramienta
│   ├── result.ts       run(): el único try/catch; errores de negocio → isError con mensaje accionable
│   ├── confirm.ts      confirmación en dos fases con token opaco y caducidad
│   ├── ping.ts         la herramienta mínima
│   └── notes.ts        el dominio de ejemplo (lectura · aditivo · irreversible)
├── api/                la única capa que habla con el exterior; devuelve datos planos
│   ├── notes-store.ts  sustitúyelo por tu cliente real
│   └── rate-limit.ts   espaciar en origen, concurrencia acotada, reintentos solo si procede
test/                   por protocolo; la API externa se dobla con vi.mock
scripts/                smoke.mjs y call.mjs: hablar con el binario por stdio
docs/SPEC-TEMPLATE.md   la spec de una página
docs/specs/             una spec por herramienta
```

## Herramientas

| Nombre | Peldaño | Anotaciones | Spec |
|---|---|---|---|
| `ping` | lectura | readOnly, idempotent, closed-world | — |
| `list_notes` | lectura | readOnly, idempotent | — |
| `add_note` | aditivo | destructive: false | — |
| `clear_notes` | irreversible | destructive, dos fases, `requiresUserInteraction` | [docs/specs/clear_notes.md](docs/specs/clear_notes.md) |

## La escalera de riesgo

Cada herramienta se clasifica antes de escribirla, y el peldaño decide el patrón:

| Peldaño | Patrón obligatorio |
|---|---|
| Solo lectura | `readOnlyHint: true`; controlar el tamaño de la respuesta (paginar, resumir) |
| Aditivo | `destructiveHint: false`; idempotente si se puede |
| Reversible | la `description` dice cómo se deshace; existe la herramienta inversa |
| Masivo | `dry_run: true` por defecto, devolviendo cuántos elementos afectaría |
| Irreversible | dos fases (`createConfirmation`) + `_meta: { 'anthropic/requiresUserInteraction': true }` |
| Sale al exterior (enviar, publicar, pagar) | todo lo anterior + `openWorldHint: true` + límite de ritmo propio |

Por qué las dos capas en lo irreversible: las anotaciones son *pistas* que el cliente puede ignorar
(Claude Code no las usa para permisos). El token protege frente al modelo; `requiresUserInteraction`
hace que Claude Code muestre el prompt a la persona en cada llamada, incluso en modo `auto`.

## Decisiones de tooling (y por qué)

- **SDK v1 (`@modelcontextprotocol/sdk` 1.x)**. Claude Code conecta a servidores stdio con su runtime
  v1 salvo que lo configures. Migra a v2 (`@modelcontextprotocol/server`) cuando quieras
  `input_required` (confirmación sin estado, spec 2026-07-28); hay codemod oficial:
  `npx @modelcontextprotocol/codemod@latest v1-to-v2 .`
- **oxlint + oxfmt en vez de ESLint + Prettier**. `typescript-eslint` no soporta TypeScript 7;
  oxlint con tipos sigue TS 7 y es ~50× más rápido. `max-lines` a 300 como aviso.
- **vitest + InMemoryTransport**. Es lo que recomienda la documentación del SDK y lo que usan los
  servidores de referencia.
- **Sin framework encima del SDK**. Lo que aporta un framework (registro declarativo, dos fases,
  errores) aquí son 60 líneas que se leen.

## Lecturas

- Spec MCP, herramientas y seguridad: https://modelcontextprotocol.io/specification/draft/server/tools
- Anthropic, cómo escribir herramientas para agentes: https://www.anthropic.com/engineering/writing-tools-for-agents
- Claude Code y MCP (permisos, `requiresUserInteraction`, elicitation): https://code.claude.com/docs/en/mcp
- SDK TypeScript, cómo testear: https://ts.sdk.modelcontextprotocol.io/v2/testing.html
- Ideas de qué construir: [IDEAS.md](IDEAS.md)
