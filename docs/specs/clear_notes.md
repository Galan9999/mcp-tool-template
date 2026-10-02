# Spec: `clear_notes`

Estado: implementada — Fecha: 2026-10-01 — Dominio: `notes`

## Para qué (una frase)

Borra todas las notas, en dos pasos obligatorios: primero previsualiza cuántas se borrarían y
devuelve un token; solo la segunda llamada con ese token borra.

## Cuándo usarla y cuándo NO

Solo cuando el humano ha pedido vaciar las notas. No para borrar una nota concreta (no existe
todavía una `delete_note`; si hace falta, es otra spec).

## Entradas

| campo | tipo | obligatorio | descripción |
|---|---|---|---|
| `confirmation_token` | string | no | Token devuelto por la primera fase. Solo pasarlo si el humano ha dicho que sí |

## Salida

Primera fase: `{ borrado: false, aviso, se_borrarian: n, confirmation_token, caduca_en: "5 minutos" }`.
Segunda fase: `{ borrado: true, notas: n, previstas: n }`. Si no hay notas, la primera fase devuelve `se_borrarian: 0` igualmente.

## Peldaño de riesgo

☐ lectura ☐ aditivo ☐ reversible ☐ masivo ☑ irreversible ☐ sale al exterior

## Anotaciones

| readOnlyHint | destructiveHint | idempotentHint | openWorldHint | requiresUserInteraction |
|---|---|---|---|---|
| false | true | false | false | true |

## Cómo se deshace / patrón de confirmación

No se deshace. Dos fases con `createConfirmation` (token UUID, 5 minutos, se consume al usarse).
La previsualización muestra el número de notas que se borrarían. `requiresUserInteraction` para
que Claude Code muestre el prompt a la persona en cada llamada.

## Llamadas al exterior

Ninguna (almacén en memoria). En un servicio real: una llamada de recuento y una de borrado; la de
borrado pasa por `withRetry` solo si el servicio garantiza idempotencia del borrado.

## Errores de negocio

| situación | mensaje |
|---|---|
| token desconocido o ya usado | "Token de confirmacion desconocido. Vuelve a llamar sin token para previsualizar." |
| token caducado | "El token caduco a los 5 minutos. Vuelve a llamar sin token para previsualizar." |

## Casos de test

1. Aparece en `tools/list` con `destructiveHint: true` y `_meta.anthropic/requiresUserInteraction: true`.
2. Sin token: devuelve `borrado: false`, el recuento correcto y un UUID; `list_notes` sigue igual.
3. Con token: borra, devuelve `borrado: true`; `list_notes` vacío.
4. Mismo token otra vez: `isError` con "desconocido".

## Fuera de alcance

Borrar notas sueltas; papelera/recuperación (si se quisiera, `clear_notes` pasaría a *reversible* y
cambiaría el patrón).
