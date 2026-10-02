---
name: verify
description: Cierra un cambio en el servidor MCP — pnpm check, llamada real por stdio, revisión de anotaciones y descripciones. Úsala antes de dar por bueno cualquier cambio o antes de un commit.
---

# Verificar el cambio actual

Un cambio no está verificado hasta que el servidor ha respondido por el protocolo. Compilar no cuenta.

1. `pnpm check`. Si falla, arregla la causa; no desactives reglas sin explicar por qué en el commit.
2. Para cada herramienta tocada, `pnpm call <tool> '<json>'` con un caso real. Pega la salida.
   Irreversible → solo la primera fase.
3. Revisa `tools/list` (la salida de `pnpm smoke` o `pnpm inspect`) y comprueba:
   - las cuatro anotaciones explícitas y coherentes con el peldaño de la spec;
   - la primera frase de la `description` dice qué hace y cuándo usarla;
   - cada campo del schema tiene `.describe()`;
   - lo irreversible lleva `_meta.anthropic/requiresUserInteraction: true`.
4. Si `max-lines` avisa de un fichero nuevo, parte por dominio antes de cerrar.
5. Diff final: nada de `console.log` en `src/`, ningún secreto, ningún scope nuevo sin anotar en el README.

Responde con: qué se verificó, qué salida dio la llamada real, y qué queda pendiente (si algo).
