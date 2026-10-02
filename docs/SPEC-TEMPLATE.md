# Spec: `<nombre_herramienta>`

Estado: borrador · aprobada · implementada — Fecha: AAAA-MM-DD — Dominio: `<dominio>`

> Una página. Si no cabe, la herramienta hace demasiado. Lo que está aquí es lo que el modelo
> leerá en `description` e `inputSchema`: escríbelo como se lo explicarías a alguien nuevo en el
> equipo que no conoce el servicio.

## Para qué (una frase)

<!-- Será la primera frase de la description: qué hace y cuándo se usa. -->

## Cuándo usarla y cuándo NO

<!-- Frente a sus vecinas: "si solo quieres cabeceras usa X; esta devuelve el cuerpo". -->

## Entradas

| campo | tipo | obligatorio | descripción (lo que el schema no dice: formato, ejemplo, límites) |
|---|---|---|---|
| `…_id` | string | sí | … |

## Salida

<!-- Forma exacta del JSON. Qué devuelve cuando no hay resultados. Tamaño máximo esperado. -->

## Peldaño de riesgo

☐ lectura ☐ aditivo ☐ reversible ☐ masivo ☐ irreversible ☐ sale al exterior

## Anotaciones

| readOnlyHint | destructiveHint | idempotentHint | openWorldHint | requiresUserInteraction |
|---|---|---|---|---|
| | | | | |

## Cómo se deshace / patrón de confirmación

<!-- Reversible: la herramienta inversa y qué se pierde. Irreversible: dos fases; qué muestra la previsualización. Masivo: dry_run. -->

## Llamadas al exterior

<!-- Endpoints, coste de cuota por llamada, permisos o scopes nuevos (justificados), ritmo. -->

## Errores de negocio

| situación | mensaje que recibirá el modelo (qué hacer a continuación) |
|---|---|
| | |

## Casos de test (por protocolo, sin API real)

1. Aparece en `tools/list` con las anotaciones de arriba.
2. …
3. …

## Fuera de alcance

<!-- Lo que alguien podría esperar y esta herramienta no hace, y por qué. -->
