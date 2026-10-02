---
name: new-api
description: Conecta una API externa real al servidor MCP (Google, GitHub, una base de datos, un servicio HTTP) — estrategia de auth, permisos mínimos, almacenamiento del token, límites de cuota y la capa src/api/. Úsala cuando el usuario quiera sustituir el dominio de ejemplo o añadir un servicio nuevo.
---

# Conectar la API: `$ARGUMENTS`

Antes de escribir una sola herramienta, deja resuelto esto y escríbelo en el `README.md` (sección
"Permisos y cuota").

## 1. Qué sabemos de la API (investigar, no suponer)

- Documentación oficial de autenticación: OAuth (¿qué flujo para una app de escritorio?), API key, token personal.
- **Permisos mínimos**: la lista exacta de scopes/permisos que necesitan las herramientas previstas,
  y cuáles se descartan a propósito (p. ej. todo lo que borra permanentemente).
- Límites de cuota: unidades por segundo/día, coste por endpoint, código de error al superarlos.
- Tamaño de las respuestas y paginación.

## 2. Auth y secretos

- Credenciales y token en `~/.config/<servidor>/` con modo `0600`; ruta configurable por variable
  de entorno. Nunca en el repo (`.gitignore` ya cubre los nombres habituales; añade los tuyos).
- Un `src/auth.ts` con `getAuthenticatedClient()` y, si hay OAuth, un `src/auth-cli.ts` con el
  flujo interactivo (`pnpm auth`). El servidor nunca abre el navegador por su cuenta.
- Mensaje de error claro si falta el token: qué comando ejecutar.

## 3. La capa `src/api/`

- Un fichero por dominio del servicio (`messages.ts`, `labels.ts`…), no uno gigante.
- `client.ts` con el cliente cacheado y el limitador: `createRateLimiter({ unitsPerSecond, unitsPerCall })`
  con los números de la documentación, no inventados. Toda lista o lectura repetida pasa por
  `mapLimited` y `withRetry` con `isRetryable` ajustado a los códigos de cuota del servicio.
- Devuelve datos planos ya normalizados (sin `null ?? ''` en la capa de herramientas).

## 4. Tests

- Los tests doblan `src/api/<dominio>.js` con `vi.mock`. Ninguno toca la API real.
- Un test afirma que la lista de scopes/permisos es exactamente la del README (evita ampliarlos por descuido).

## 5. Después

- Borra el dominio de ejemplo (`notes`) cuando ya no lo necesites: `src/api/notes-store.ts`,
  `src/tools/notes.ts`, su registro en `server.ts`, su test y su spec.
- Cada herramienta nueva pasa por `/new-tool`.
