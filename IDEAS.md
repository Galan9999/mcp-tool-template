# Ideas: servidores MCP que mejoran la vida de la gente

Criterio para elegir una (en este orden): (1) parte de un dato que **ya tienes** (tu correo, tus
ficheros, una API con cuenta); (2) la primera versión es **solo lectura**; (3) la usas tú antes que
nadie; (4) nunca necesita ejecutarse sin un humano en la conversación (eso es un cron, no un MCP).

Cada idea lleva el peldaño de riesgo más alto que toca, porque eso decide cuánto diseño pide
(ver la escalera en el README). *Sin red* = funciona con ficheros locales, sin credenciales.

## Salud y hábitos

| Idea | Fuente de datos | Peldaño | Por qué mejora la vida |
|---|---|---|---|
| Diario de síntomas y medicación consultable ("¿cuántas noches dormí mal este mes?") | markdown local, *sin red* | lectura / aditivo | preparar una consulta médica con datos y no con recuerdos |
| Recordatorios de citas médicas a partir del correo (confirmaciones, resultados) | Gmail + Calendar | aditivo | nada se pierde entre el correo y la agenda |
| Lectura de exportaciones de la báscula, el reloj o la app de pasos | CSV/JSON local, *sin red* | lectura | ver tendencias sin la app que quiere venderte algo |
| Planificador de comidas que lee la despensa y la lista de la compra | fichero local, *sin red* | aditivo | menos desperdicio, menos "¿qué cenamos?" |

## Dinero sin sustos

| Idea | Fuente de datos | Peldaño | Por qué |
|---|---|---|---|
| Lector de extractos bancarios en PDF/CSV → tabla de movimientos con `structuredContent` | ficheros locales, *sin red* | lectura | categorizar gastos sin dar acceso a la cuenta a nadie |
| Detector de suscripciones y cargos recurrentes que suben | extractos locales | lectura | "esto subió 3 € y no te avisaron" |
| Avisos de renovación (seguros, dominios, contratos) a partir del correo | Gmail | lectura + Calendar aditivo | evitar renovaciones automáticas no deseadas |
| Facturas: encontrar, descargar y archivar por trimestre | Gmail + disco | aditivo (en disco) | la declaración trimestral sin buscar en 400 correos |

## Burocracia y administración

| Idea | Fuente de datos | Peldaño | Por qué |
|---|---|---|---|
| Plazos administrativos (multas, impuestos, becas) extraídos de correos y cartas escaneadas | Gmail + PDF/OCR local | lectura | el plazo que se pasa cuesta dinero |
| Carpeta de documentos personales con búsqueda ("¿dónde está el certificado de empadronamiento?") | disco, *sin red* | lectura | 10 minutos ahorrados cada vez |
| Asistente para formularios: rellena un borrador con tus datos y lo deja para revisar | fichero local de datos + plantillas | aditivo (borrador) | nunca envía: la persona firma |
| Seguimiento de reclamaciones (qué pediste, cuándo, qué contestaron) | Gmail | lectura | ganar la discusión con la compañía con fechas |

## Familia y cuidados

| Idea | Fuente de datos | Peldaño | Por qué |
|---|---|---|---|
| Agenda compartida de cuidados (medicación, visitas, turnos) de un familiar mayor | calendario compartido | aditivo | varias personas cuidando sin pisarse |
| Correo del colegio: circulares, fechas, pagos, resumidos y puestos en la agenda | Gmail + Calendar | aditivo | el 80 % de "se me pasó" viene del correo del cole |
| Lista de regalos y fechas importantes con avisos con antelación | fichero local, *sin red* | aditivo | acordarse de la gente |
| Archivo de fotos por persona y fecha para hacer álbumes | disco, *sin red* | lectura | las fotos existen; verlas, no |

## Aprender y crear

| Idea | Fuente de datos | Peldaño | Por qué |
|---|---|---|---|
| Notas personales (Obsidian/markdown) como recursos `notes://` + búsqueda | disco, *sin red* | lectura / aditivo | el modelo trabaja con lo que sabes, no con lo que inventa |
| Cuaderno de lectura: subrayados exportados del lector, consultables por tema | ficheros locales | lectura | reencontrar lo que te importó |
| Tutor de idioma que corrige tus correos antes de enviarlos, con tu voz | prompt `mi_voz` + borradores | aditivo (borrador) | mejorar sin que escriba por ti |
| Repositorio de recetas de familia con escalado de cantidades | markdown local | aditivo | patrimonio que se pierde si no se escribe |

## Accesibilidad e inclusión

| Idea | Fuente de datos | Peldaño | Por qué |
|---|---|---|---|
| Lector de correo "en claro": resume y explica correos administrativos en lenguaje llano | Gmail | lectura | la carta del banco entendida a la primera |
| Traductor de documentos oficiales para quien no domina el idioma, con glosario | PDF local | lectura | autonomía |
| Descripción de imágenes de un álbum para una persona con baja visión | disco | lectura | compartir recuerdos |
| Conversión de documentos a texto grande / audio | disco, *sin red* | aditivo (en disco) | acceso |

## Comunidad y ciudad

| Idea | Fuente de datos | Peldaño | Por qué |
|---|---|---|---|
| Datos abiertos municipales (horarios, incidencias, calidad del aire) como herramientas de consulta | APIs públicas | lectura | la ciudad consultable en una frase |
| Tablón de la comunidad de vecinos: actas, derramas, averías, buscables | PDFs locales | lectura | las actas existen; nadie las lee |
| Coordinación de un voluntariado: turnos, disponibilidad, avisos (borradores, no envíos) | calendario + correo | aditivo (borrador) | menos grupos de WhatsApp |
| Préstamo de cosas entre vecinos (taladro, escalera) con registro | fichero compartido | aditivo | menos comprar, más prestar |

## Trabajo sin quemarse

| Idea | Fuente de datos | Peldaño | Por qué |
|---|---|---|---|
| Resumen de lo que entró hoy agrupado por qué pide de ti (decidir, contestar, solo leer) | Gmail | lectura | abrir el correo con un plan |
| Detector de hilos que esperan tu respuesta hace más de N días | Gmail | lectura | no fallar a la gente |
| Tiempo de foco: bloquear la agenda a partir de tareas pendientes | Calendar | aditivo | el calendario defiende tu tiempo |
| Preparación de reuniones: qué se dijo la última vez con esa persona (correo + notas) | Gmail + notas | lectura | llegar preparado |

## Meta: herramientas para hacer herramientas

| Idea | Peldaño | Por qué |
|---|---|---|
| Un servidor que audita a otro por stdio: anotaciones, descripciones, schemas con `.describe()`, nombres válidos | lectura | es `scripts/smoke.mjs` convertido en producto |
| Un servidor "espejo" que registra cada llamada que recibe (argumentos, `_meta`, orden) | lectura | ver exactamente qué envía Claude Code |
| Un servidor de ejemplo con las tres formas de confirmar (token, elicitation, `input_required` con SDK v2) | irreversible (simulada) | aprender comparando en vivo |

## Lo que no haría con un MCP

Nada que deba correr sin una persona en la conversación (cron + script). Nada cuyo valor sea
"borrar rápido". Nada que mueva dinero o publique en nombre de alguien sin que esa persona vea
exactamente qué va a salir y lo apruebe en un prompt que no se puede saltar.
