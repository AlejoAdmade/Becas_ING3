# Cómo BecaClara resuelve el Caso 6 para el IFARHU

> Documento de equipo. Responde directamente al caso planteado: IFARHU, Ley 40 de 2010, +100,000 estudiantes afectados, errores en pagos y duplicidad de datos.

## 1. El problema que enfrenta el IFARHU hoy

El IFARHU administra el **PASE-U** (beca universal creada por la Ley 40 de 26 de julio de 2010) para más de 100,000 estudiantes. Evidencia reciente muestra que el problema no es hipotético:

- **US$14 millones** perdidos por pago doble del PASE-U (Listo Wallet / AIG, octubre 2023), duplicados por el procesador Fintex — sin responsable formalmente asumido. ([Midiario](https://www.midiario.com/nacionales/pago-duplicado-de-pase-u-un-error-de-14-millones-de-dolares-sin-responsables/), [TVN Panamá](https://www.tvn-2.com/nacionales/reportado-error-duplicidad-becas-ifarhu-aig-autoridad-innovacion-gubernamental_1_2125057.html))
- **US$38 millones** en lesión patrimonial por auxilios económicos irregulares, según auditorías de la Contraloría General. ([La Prensa](https://www.prensa.com/sociedad/ifarhu-lesion-patrimonial-por-auxilios-irregulares-asciende-a-38-millones/))
- Un exdirector regional del IFARHU fue aprehendido por irregularidades en el PASE-U. ([Telemetro](https://www.telemetro.com/nacionales/aprehenden-exdirector-del-ifarhu-panama-este-irregularidades-la-beca-pase-u-n6073453))

El patrón común: **no había forma de reconstruir quién aprobó qué, bajo qué regla, ni quién era responsable cuando algo salía mal.** Ese es el problema exacto que BecaClara ataca.

## 2. Mapeo: problema del IFARHU → solución en BecaClara

| Problema real del IFARHU | Solución implementada en BecaClara |
|---|---|
| Pago doble del PASE-U (Listo Wallet, $14M) | Clave única `solicitud + número de cuota` antes de desembolsar. Un segundo intento de pago se **bloquea automáticamente** y queda registrado como `PAGO_DUPLICADO_BLOQUEADO` en la bitácora (`app.js` → `processPayment()`). |
| Beneficiarios duplicados / múltiples registros de la misma persona | Verificación de `cédula + periodo` al crear la solicitud. Un duplicado se rechaza y se audita como `SOLICITUD_DUPLICADA_BLOQUEADA`, sin llegar a evaluarse dos veces. |
| Auxilios/decisiones sin trazabilidad ($38M sin explicación clara) | Cada solicitud guarda **la política exacta con la que fue evaluada** (versión, promedio mínimo, asistencia mínima), y el dictamen se explica criterio por criterio, no solo con un veredicto. |
| "Error sin responsables" (nadie asumió el error de Fintex/AIG) | Bitácora de auditoría inmutable: cada evento (aprobación, rechazo, pago, bloqueo) queda con actor, fecha y detalle. No existe función para editar o borrar un evento. |
| Cambios de política que invalidan decisiones pasadas | Motor de políticas versionado: crear una nueva versión (ej. nuevo promedio mínimo) no modifica las solicitudes ya evaluadas con la versión anterior. Se puede cambiar el requisito sin tocar código. |
| Falta de rendición de cuentas pública proactiva (se supo por auditoría externa, no por transparencia del sistema) | Portal de transparencia con indicadores agregados (solicitudes, aprobados, montos por provincia) **sin datos personales**, disponible en todo momento, no solo cuando llega la Contraloría. |

## 3. Respuesta directa a la pregunta del caso

> ¿Cómo diseñarías un sistema transparente, seguro y adaptable a cambios de política pública?

Para el IFARHU específicamente, la respuesta de BecaClara es:

1. **Transparente**: portal público con métricas agregadas por provincia y programa, sin exponer cédulas ni datos académicos — así el IFARHU puede demostrar en cualquier momento cuántas becas se otorgaron y cuánto se pagó, sin depender de una auditoría reactiva de la Contraloría.
2. **Seguro**: no en el sentido de "anti-hackers", sino de integridad de las decisiones — ninguna aprobación, rechazo o pago puede ocurrir dos veces con la misma llave, y ningún evento de la bitácora puede alterarse después de registrado. Esto es directamente lo que habría evitado el pago duplicado de $14M: el sistema, no el procesador de pagos externo, es la última línea de control.
3. **Adaptable**: la Ley 40 y sus reglamentos pueden cambiar (montos, requisitos de promedio o asistencia). El motor de políticas versionado permite que el IFARHU ajuste esos parámetros sin modificar código y sin perder la trazabilidad de cómo se evaluó cada solicitud histórica.

## 4. Qué ya demuestra el prototipo (Sprint 1 / Fase 2–3 de `ESTRUCTURA`)

- Dashboard con indicadores en tiempo real.
- Creación y evaluación automática de solicitudes contra la política vigente.
- Rechazos con motivo exacto (ej. "Promedio 2.5 inferior al mínimo requerido de 3.0").
- Detección de solicitudes duplicadas.
- Políticas versionadas y configurables sin tocar código.
- Pagos simulados con bloqueo de pago duplicado.
- Bitácora de auditoría completa.
- Portal de transparencia sin datos personales.

## 5. Qué falta para que la respuesta sea completa frente al caso

- **Login y roles reales** (analista, funcionario, finanzas, público) — hoy el perfil es solo una etiqueta visual, no hay control de acceso.
- **Entidad "estudiante" separada de "solicitud"**, para dar seguimiento a un beneficiario a través de múltiples periodos/becas, no solo a un expediente puntual.
- **Conciliación contra el procesador de pagos externo** — hoy el bloqueo de duplicado es interno; en la vida real (caso Fintex) el error vino de fuera del sistema del IFARHU, por lo que también se necesitaría validar la respuesta del procesador antes de darla por buena.
- **Cruce de identidad contra fuentes externas** (Tribunal Electoral, MEDUCA) — en el prototipo está simulado, no conectado.

Estos puntos ya están identificados como pendientes de Fase 2–4 en `ESTRUCTURA` y deben quedar explícitos en cualquier presentación para no sobreprometer el alcance actual.
