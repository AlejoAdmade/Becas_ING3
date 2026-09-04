# Criterios de la beca derivados de la Ley 40 de 2010

> Documento de equipo. Responde al entregable de Fase 1 de `ESTRUCTURA.md`: "Criterios de la beca derivados de la Ley 40". Fundamenta los valores que el motor de políticas de BecaClara usa como semilla.

## 1. Fuente legal

**Ley N.º 40 de 23 de agosto de 2010**, que regula el Programa de Beca Universal (hoy **PASE-U** — Programa de Asistencia Social Educativa Universal) y modifica un artículo de la Ley 8 de 2010 sobre su financiamiento.

- Texto oficial: [Ley No. 40 de 23-08-2010 (Asamblea Nacional)](https://s3-legispan.asamblea.gob.pa/legispan/NORMAS/2010/2010/LEY/Administrador%20Legispan_26604_2010_8_23_ASAMBLEA%20NACIONAL_40.pdf)
- Programa vigente: [IFARHU — PASE-U](https://www.ifarhu.gob.pa/becas/pase-u/)

## 2. Requisitos de elegibilidad

| Requisito | Detalle | Fuente |
|---|---|---|
| Matrícula regular | Alumno del primer o segundo nivel de enseñanza (subsistema regular o educación especial del subsistema no regular) | [IFARHU](https://www.ifarhu.gob.pa/becas/pase-u/) |
| Rendimiento académico | Promedio mínimo de **3.0** en primaria, o su equivalente por asignatura en premedia y media | [Ley 40](https://s3-legispan.asamblea.gob.pa/legispan/NORMAS/2010/2010/LEY/Administrador%20Legispan_26604_2010_8_23_ASAMBLEA%20NACIONAL_40.pdf), [La Estrella](https://www.laestrella.com.pa/panama/informacion-util/quieres-una-beca-del-ifarhu-este-es-el-promedio-que-debes-tener-OD18822387) |
| No duplicidad de beneficio | El estudiante **no debe contar con otro beneficio educativo estatal** simultáneo | [Ley 40](https://s3-legispan.asamblea.gob.pa/legispan/NORMAS/2010/2010/LEY/Administrador%20Legispan_26604_2010_8_23_ASAMBLEA%20NACIONAL_40.pdf) |
| Asistencia | Asistencia regular a clases durante el año lectivo | [IFARHU](https://www.ifarhu.gob.pa/becas/pase-u/) |
| Conducta | Buena conducta según el reglamento interno del centro educativo | [IFARHU](https://www.ifarhu.gob.pa/becas/pase-u/) |
| Boletín | Boletín del tercer trimestre con calificaciones aprobatorias | [IFARHU](https://www.ifarhu.gob.pa/becas/pase-u/) |
| Control de salud | Copia de la ficha de control de vacunación, talla y peso | [IFARHU](https://www.ifarhu.gob.pa/becas/pase-u/) |
| Participación del acudiente | Visitas periódicas del representante legal al centro educativo y participación en charlas de escuela para padres | [IFARHU](https://www.ifarhu.gob.pa/becas/pase-u/) |

**Nota de honestidad metodológica:** la ley y las fuentes consultadas hablan de "asistencia regular", pero no encontré un **porcentaje** exacto (ej. 80%) fijado en el texto de la Ley 40 misma — ese umbral suele definirse en el reglamento operativo (resolución/decreto de MEDUCA-IFARHU), no en la ley. El valor `minAttendance: 80` que ya usa el prototipo (`data.js`) es un **supuesto de diseño razonable del equipo**, no una cita literal de la ley. Antes de la presentación final, vale la pena buscar el reglamento específico o, si no se encuentra, dejarlo declarado explícitamente como supuesto en la presentación (ver `docs/02-arquitectura.md`, principio 2: la fuente de cada regla debe quedar registrada).

## 3. Montos por nivel educativo

El beneficio se paga en **3 desembolsos anuales**:

| Nivel | Monto anual | Monto por pago (÷3) |
|---|---|---|
| Primaria | B/.270.00 | B/.90.00 |
| Premedia | B/.360.00 | B/.120.00 |
| Media | B/.450.00 | B/.150.00 |

Fuente: [Telemetro — requisitos PASE-U](https://www.telemetro.com/nacionales/ifarhu-pase-u-estos-son-los-requisitos-recibir-el-beneficio-n5997662), [IFARHU — requisitos de cobro](https://www.ifarhu.gob.pa/requisitos-cobrar-beneficio-becas-pase-u-primer-segundo-pago-becas-asistencias-nuevas-2024/)

**Validación contra el prototipo:** los montos por pago que ya usa `data.js` (`primaryAmount: 90, middleAmount: 120, highAmount: 150`) **coinciden exactamente** con las cifras reales de PASE-U. No requieren cambio.

## 4. Causales de suspensión o pérdida de la beca

| Causal | Detalle |
|---|---|
| Sentencia penal firme | Cualquier sentencia penal firme contra el estudiante suspende el pago |
| Cambio a colegio no habilitado | Traslado a un centro educativo particular que no cumpla los requisitos que exige la ley |
| Renuncia expresa | El acudiente renuncia a la beca, por escrito |
| Incumplimiento de requisitos | Dejar de cumplir promedio, asistencia o conducta exigidos (implícito: la beca no es automática por periodo, se reevalúa) |

Fuente: [La República — razones de suspensión del PASE-U](https://larepublica.pe/datos-lr/panama/2024/12/27/no-volveras-a-recibir-el-paseu-de-ifarhu-si-cometes-estos-errores-las-razones-por-las-que-te-suspenderian-el-pago-de-la-beca-lrtmc-2158758)

## 5. Mapeo a la tabla `politicas` (PostgreSQL, versionada)

Siguiendo el principio 2 de `docs/02-arquitectura.md` ("reglas en datos, no en código"), estos criterios se cargan como una fila versionada, no como una condición en el código:

| Campo de la tabla `politicas` | Valor semilla (política 2026.01) | Fundamento |
|---|---|---|
| `min_average` | 3.0 | Ley 40, Art. de requisitos académicos |
| `min_attendance` | 80 (**supuesto de diseño**, ver nota arriba) | No confirmado en el texto de la ley — pendiente de validar con reglamento |
| `primary_amount` | 90.00 | Monto oficial por pago, nivel primaria |
| `middle_amount` | 120.00 | Monto oficial por pago, nivel premedia |
| `high_amount` | 150.00 | Monto oficial por pago, nivel media |
| `requires_no_other_state_benefit` | true | Ley 40 — no duplicidad de beneficio educativo estatal |
| `effective_from` | 2026-01-01 | Fecha de vigencia definida por el equipo para la demo |
| `fundamento` | "Ley 40 de 2010, PASE-U" | Trazabilidad legal de la versión |

Cada solicitud evaluada debe guardar una referencia a la versión de esta tabla vigente al momento de la evaluación (no una copia suelta de los valores), para que el `fundamento` completo quede accesible desde cualquier expediente histórico.

## 6. Pendiente antes de la presentación final

- [ ] Confirmar el porcentaje exacto de asistencia mínima en el reglamento operativo (no en la ley), o declarar explícitamente que es un supuesto del equipo.
- [ ] Confirmar si existe un requisito de edad máxima/mínima por nivel que no haya quedado capturado aquí.
- [ ] Verificar si la causal "incumplimiento de requisitos" tiene un proceso formal de notificación antes de suspender (relevante para el principio 6 de `docs/02-arquitectura.md`: marcar, no bloquear).
