# Plan de Entregables por Fases

> Complemento de `docs/01-solucion-ifarhu.md` (qué problema resuelve) y `docs/02-arquitectura.md` (principios de diseño). Vive en la raíz del repositorio como `ESTRUCTURA.md`.
> 4 fases · 4 entregas formales · Equipo de 4 estudiantes

---

## 0. Principio rector

**Cada entrega debe poder demostrarse funcionando, no solo describirse.**

Este es el error más común en proyectos por fases: dividir el trabajo por capas. "Fase 1: todo el HTML. Fase 2: todo el JavaScript." El resultado es que en la primera entrega no hay nada que mostrar, y en la última todo se acumula.

La división correcta es por funcionalidad completa. Cada fase toma un problema del caso y lo resuelve de punta a punta: datos, lógica, pantalla y pruebas. Al final de cada entrega se puede decir *"esto ya funciona, míralo"*.

Cada fase cierra una fila de la tabla de trazabilidad del caso:

| Fase | Problema del caso que cierra |
|---|---|
| 1 | Diseño de la solución (ningún módulo aún) |
| 2 | P1 — Duplicidad de datos |
| 3 | P3 Validación automática · R1 Transparencia · R2 Adaptabilidad |
| 4 | P2 Errores en pagos · P4 Trazabilidad |

Esto le da a la presentación final una estructura natural: cuatro entregas, cuatro problemas resueltos.

---

## 0.1 Stack tecnológico

| Capa | Herramienta | Nota |
|---|---|---|
| Frontend + backend | **JavaScript** (Node/Express en el backend) | Un solo lenguaje en todo el proyecto |
| Base de datos | **PostgreSQL**, instalación nativa | Sin Docker ni Supabase por ahora; cada integrante instala su propia instancia local con el mismo `db/schema.sql` |
| Pruebas E2E | **Cypress** | Corre contra el backend real, no contra mocks |
| Pruebas de seguridad | **sqlmap** | Apunta a los endpoints del backend para verificar que las consultas parametrizadas resisten inyección SQL |
| CI/CD | **GitLab CI** | Implica migrar el repositorio de GitHub a GitLab; el pipeline levanta Postgres como servicio (`services: postgres:16`) solo para esa corrida — no aloja la app en vivo |

Regla de diseño no negociable: **ninguna consulta SQL se arma por concatenación de strings.** Todo pasa por parámetros (`$1, $2...` del driver `pg`), tanto porque es la práctica correcta como porque es lo que se verifica en la fase de seguridad con sqlmap.

Ver `docs/02-arquitectura.md` para los siete principios de diseño (ID interno como llave primaria, pago idempotente, bitácora append-only firmada, separación de roles, etc.) que estas fases implementan.

---

## 1. Mapa de las cuatro fases

| Fase | Nombre | Objetivo | Se demuestra con |
|---|---|---|---|
| **1** | Planificación y diseño | Definir qué se va a construir y cómo | Documentos, bocetos, casos de prueba |
| **2** | Registro sin duplicados | Registrar estudiantes detectando duplicados | Pantalla de registro funcionando + bitácora |
| **3** | Validación automática | Evaluar solicitudes contra reglas versionadas | Dictamen en pantalla + cambio de política en vivo |
| **4** | Pagos y transparencia | Pagar sin duplicar y publicar totales | Pago rechazado por duplicado + página pública |

---

## 2. Entregables por fase

### FASE 1 — Planificación y diseño

*Sin código. Se entrega el plano del edificio.*

| Entregable | Archivo | Responsable |
|---|---|---|
| Documento del caso: contexto, alcance, qué no se hará | `docs/01-solucion-ifarhu.md` | PO |
| Principios de arquitectura (los 7 + idea central) | `docs/02-arquitectura.md` | PO + Backend |
| Criterios de la beca derivados de la Ley 40 | `docs/03-reglas.md` | PO |
| Este plan de fases con fechas asignadas | `ESTRUCTURA.md` | PO |
| Definición de los 5 módulos con sus funciones | `docs/04-modulos.md` | Backend |
| Modelo de datos: entidades y llaves (`id_interno` como PK, no cédula) | `db/schema.sql` | Backend |
| Bocetos de las 5 pantallas | `docs/bocetos/` | Frontend |
| Casos de prueba iniciales (incluye escenarios Cypress a cubrir) | `qa/casos-prueba.md` | QAS |
| Datos de prueba con duplicados incluidos | `db/seed.sql` | QAS |
| Pipeline base de GitLab CI (corre, aunque los jobs estén vacíos) | `.gitlab-ci.yml` | Backend |
| Repositorio con la estructura de carpetas creada | Todo el árbol, archivos vacíos | Backend |

**Qué se presenta:** el problema del caso, la tabla de trazabilidad, los principios de arquitectura, el stack tecnológico y el plan de trabajo. Se explica *qué* se va a construir y *por qué* así.

**Criterios para cerrar la fase:**
- [ ] La tabla de trazabilidad problema → módulo está completa y aprobada por los cuatro
- [ ] Los criterios de la beca están definidos con su fundamento legal
- [ ] El modelo de datos usa `id_interno` como llave primaria, no la cédula
- [ ] Cada función de cada módulo tiene definido qué recibe y qué devuelve
- [ ] Los datos de prueba incluyen al menos un duplicado exacto y uno aproximado
- [ ] El pipeline de GitLab CI corre sin fallar (aunque no pruebe nada todavía)
- [ ] Cada integrante sabe cuáles son sus archivos

**Todavía no se entrega:** ninguna pantalla funcional.

---

### FASE 2 — Registro sin duplicados

*Primera entrega con algo que corre. Cierra el problema de duplicidad de datos.*

| Entregable | Archivo | Responsable |
|---|---|---|
| Conexión a PostgreSQL y consultas parametrizadas base | `server/db.js` | Backend |
| Módulo de beneficiarios: `id_interno` como PK, cédula como atributo validado, detección de duplicados | `server/beneficiarios.js` | Backend |
| Módulo de bitácora append-only con hash encadenado + firma institucional | `server/bitacora.js` | Backend |
| Página de inicio | `index.html` | Frontend |
| Pantalla de registro funcionando | `paginas/postular.html` | Frontend |
| Hojas de estilo base | `css/estilos.css`, `css/componentes.css` | Frontend |
| Pruebas E2E de registro y duplicados en Cypress | `cypress/e2e/registro.cy.js` | QAS |
| Capturas de los 3 escenarios de duplicado | `entregas/fase-2/evidencia/` | QAS |
| Informe de avance de la fase | `entregas/fase-2/informe.md` | PO |

**Qué se demuestra en vivo:**
1. Se registra un estudiante nuevo y se guarda con un `id_interno` propio del sistema.
2. Se corrige la cédula de ese mismo registro (documento mal digitado): el sistema actualiza el registro existente, no crea uno nuevo, porque la llave es `id_interno`, no la cédula.
3. Se intenta registrar la misma cédula en un registro distinto: el sistema lo rechaza y explica por qué.
4. Se intenta con el mismo nombre y fecha de nacimiento pero otra cédula: lo marca como posible duplicado.
5. Se abre la bitácora y se ven los intentos registrados con fecha, hora y el hash que los encadena.

**Criterios para cerrar la fase:**
- [ ] Los datos sobreviven al recargar la página (persistidos en PostgreSQL, no en `localStorage`)
- [ ] La llave primaria de beneficiario es `id_interno`, no la cédula
- [ ] Ningún duplicado logra guardarse
- [ ] Toda acción, incluidos los rechazos, queda en la bitácora
- [ ] La bitácora es append-only: cada evento incluye el hash del anterior, y no existe ninguna ruta (API, consola, admin) para editar o borrar un evento sin romper la cadena
- [ ] Las pruebas Cypress de registro y duplicados pasan en local y en el pipeline de GitLab CI

**Todavía no se entrega:** validación de becas, solicitudes, pagos.

---

### FASE 3 — Validación automática

*La fase con más peso técnico. Cierra validación automática, transparencia y adaptabilidad.*

| Entregable | Archivo | Responsable |
|---|---|---|
| Catálogo de políticas versionadas (tabla `politicas`, con vigencia y fundamento legal) | `db/schema.sql` (tabla) + `server/politicas.js` | PO + Backend |
| Módulo de validación con dictamen detallado | `server/validacion.js` | Backend |
| Módulo de solicitudes con estados (incluye `EN_REVISION`) | `server/solicitudes.js` | Backend |
| Pantalla de consulta de estado y dictamen | `paginas/consultar.html` | Frontend |
| Pantalla del funcionario | `paginas/funcionario.html` | Frontend |
| Pruebas E2E de validación, cambio de política y estado en revisión | `cypress/e2e/validacion.cy.js` | QAS |
| Evidencia del cambio de política antes/después | `entregas/fase-3/evidencia/` | QAS |
| Informe de avance de la fase | `entregas/fase-3/informe.md` | PO |

**Qué se demuestra en vivo:**
1. Un estudiante crea una solicitud y el sistema la evalúa automáticamente contra la política vigente (dato versionado, no un `if` en el código — ver `docs/02-arquitectura.md`).
2. El dictamen se muestra criterio por criterio: promedio requerido contra promedio real, cada uno con su marca de cumplido o no cumplido.
3. Un caso con un dato inconsistente (no concluyente) queda en estado **`EN_REVISIÓN`**, no rechazado de plano: se notifica al estudiante y se muestra el plazo de subsanación.
4. Se cambia el promedio mínimo creando una nueva versión de política, con su fundamento (ej. "Resolución 123").
5. Un estudiante antes rechazado ahora califica.
6. Se abre una solicitud anterior y **sigue mostrando la regla con la que fue evaluada originalmente**.

El punto 6 es el más valioso de todo el proyecto. Demuestra que el sistema es adaptable sin perder trazabilidad, que es exactamente lo que pregunta el caso.

**Criterios para cerrar la fase:**
- [ ] Ninguna aprobación ocurre por criterio manual
- [ ] El dictamen nunca muestra solo un veredicto: siempre el detalle
- [ ] Cada solicitud guarda la versión de política que se le aplicó, con su fundamento legal
- [ ] Cambiar una política no altera solicitudes ya evaluadas
- [ ] Un dato inconsistente pero no concluyente pasa a `EN_REVISIÓN`, no se rechaza automáticamente
- [ ] Los estados de la solicitud solo avanzan por las transiciones permitidas
- [ ] Las pruebas Cypress de validación y cambio de política pasan en el pipeline de GitLab CI

**Todavía no se entrega:** pagos, página pública de transparencia.

---

### FASE 4 — Pagos y transparencia

*Cierre. Resuelve el problema de pagos y consolida la trazabilidad.*

| Entregable | Archivo | Responsable |
|---|---|---|
| Módulo de pagos idempotente (clave única beneficiario + convocatoria + periodo, restricción a nivel de base de datos) | `server/pagos.js` | Backend |
| Roles separados: registra / aprueba / ejecuta pago, con permisos distintos | `server/auth.js` | Backend |
| Funciones de totales y reportes | `server/bitacora.js` (ampliado) | Backend |
| Página pública de transparencia (agregados, sin datos personales) | `paginas/transparencia.html` | Frontend |
| Consulta individual autenticada: el estudiante ve su propio estado y motivo | `paginas/consultar.html` (ampliada, requiere login) | Frontend |
| Pruebas E2E de pago, duplicidad de pago y roles | `cypress/e2e/pagos.cy.js` | QAS |
| Informe de pruebas de seguridad con sqlmap contra los endpoints | `security/sqlmap-informe.md` | QAS |
| Todos los casos de prueba ejecutados | `qa/resultados.md` final | QAS |
| Reporte final de calidad con incidencias | `qa/reporte-final.md` | QAS |
| Manual de uso breve | `README.md` | PO |
| Presentación final | `docs/05-presentacion.md` | PO |
| Video de respaldo de la demo | `entregas/fase-4/demo.mp4` | PO + Frontend |
| Informe final del proyecto | `entregas/fase-4/informe.md` | PO |

**Qué se demuestra en vivo:**
1. Se aprueba una solicitud (rol "aprueba") y otro usuario con rol "ejecuta pago" registra el desembolso — no la misma persona.
2. Se presiona pagar otra vez: el sistema lo rechaza porque la clave beneficiario + convocatoria + periodo ya existe, por restricción de la base de datos, no por una validación que alguien podría olvidar.
3. Se abre la bitácora y aparece el intento rechazado, no oculto, encadenado al resto de eventos.
4. La página pública muestra totales por provincia y programa, sin ningún dato personal.
5. Un estudiante inicia sesión y consulta su propio historial completo, desde su registro hasta su pago.
6. Se corre sqlmap contra los endpoints del backend y no encuentra ninguna inyección explotable, porque todas las consultas usan parámetros.

**Criterios para cerrar la fase:**
- [ ] Es imposible registrar dos veces el mismo pago, aunque el proceso se dispare dos veces a la vez (la restricción vive en la base de datos, no solo en el código)
- [ ] Ninguna persona puede aprobar y ejecutar el mismo pago
- [ ] La página pública no expone ni un solo dato personal
- [ ] El estudiante solo puede consultar su propio historial, autenticado
- [ ] sqlmap no encuentra vulnerabilidades de inyección SQL en los endpoints probados
- [ ] Los 6 momentos de la demo salen sin errores tres veces seguidas
- [ ] Existe el video de respaldo

---

## 3. Matriz de entregables por rol

| | Fase 1 | Fase 2 | Fase 3 | Fase 4 |
|---|---|---|---|---|
| **Backend** | Esquema PostgreSQL, `.gitlab-ci.yml` base | conexión DB, beneficiarios (`id_interno`), bitácora firmada | políticas versionadas, validación, solicitudes (`EN_REVISIÓN`) | pagos idempotentes, roles, reportes |
| **Frontend** | Bocetos de 5 pantallas | index + registro + CSS base | consultar + funcionario | transparencia + historial autenticado |
| **QAS** | Casos de prueba + datos semilla SQL | Cypress: registro y duplicados | Cypress: validación y cambio de política | Cypress: pagos y roles + informe sqlmap |
| **PO** | Caso, arquitectura, reglas, plan de fases | Informe de avance | Informe de avance | Presentación, manual, informe final |

Nadie entrega cero en ninguna fase. Si algún rol queda sin trabajo en una fase, el reparto está mal hecho.

---

## 4. Cómo se empaqueta cada entrega

Una carpeta por entrega, siempre con la misma estructura. Así el avance es visible y comparable entre fases.

```
entregas/
├── fase-1/
│   ├── informe.md
│   └── documentos/           # Copia de los docs entregados
├── fase-2/
│   ├── informe.md
│   └── evidencia/            # Capturas de pantalla numeradas
├── fase-3/
│   ├── informe.md
│   └── evidencia/
└── fase-4/
    ├── informe.md
    ├── evidencia/
    ├── demo.mp4
    └── presentacion.pdf
```

Las capturas se nombran por lo que demuestran, no por el orden en que se tomaron: `01-duplicado-rechazado.png`, `02-bitacora-con-intento.png`. Quien las revise entiende sin abrirlas.

---

## 5. Plantilla del informe de avance

El mismo formato en las cuatro fases. Se copia y se llena. Repetir la estructura hace que el avance se lea de un vistazo.

```markdown
# Informe de Avance — Fase N

**Proyecto:** Sistema de Becas — Caso 6 (IFARHU)
**Fecha de entrega:** dd/mm/aaaa
**Equipo:** [nombres y roles]

## 1. Objetivo de esta fase
Una o dos frases.

## 2. Problema del caso que se resuelve
Fila de la tabla de trazabilidad que esta fase cierra.

## 3. Entregables completados
| Entregable | Responsable | Estado |
|---|---|---|
| | | Completo / Parcial |

## 4. Qué se puede demostrar
Lista numerada de lo que funciona y se puede mostrar en pantalla.

## 5. Evidencia
Referencia a las capturas y una línea de qué muestra cada una.

## 6. Resultados de pruebas
Casos ejecutados: N · Aprobados: N · Fallidos: N
Detalle de los fallidos y qué se hará con ellos.

## 7. Pendientes que pasan a la siguiente fase
Con motivo. Un pendiente sin motivo es un pendiente olvidado.

## 8. Dificultades y cómo se resolvieron
La parte que más valoran los evaluadores: demuestra criterio, no solo ejecución.

## 9. Qué viene en la fase siguiente
```

---

## 6. Si una fase se atrasa

Regla única: **se recorta funcionalidad, nunca calidad ni evidencia.**

Es preferible entregar tres módulos bien probados y documentados que cinco a medias sin pruebas. Si el tiempo no alcanza:

1. Se recorta de la lista de "sí lo hacemos" del alcance, y se anota en el informe como pendiente con motivo.
2. Nunca se recorta la bitácora ni las pruebas. Son los dos elementos que sostienen la propuesta ante el caso.
3. Se avisa en el informe de avance de esa fase, no en la siguiente.

Un pendiente declarado con su razón demuestra control del proyecto. Un pendiente descubierto por el evaluador demuestra lo contrario.

---

## 7. Ajustar el plan a otro número de entregas

**Si son 3 entregas:** se fusionan las fases 1 y 2. La primera entrega incluye documentación más registro funcionando. Es más exigente al inicio pero viable.

**Si son 5 entregas:** se divide la fase 3, que es la más cargada. Una entrega para políticas y validación, otra para solicitudes y la pantalla del funcionario.

**Si son 2 entregas:** fases 1 y 2 juntas, fases 3 y 4 juntas. En este caso conviene mover la página pública de transparencia a trabajo futuro.

Lo que no debe cambiar en ningún escenario: cada entrega cierra al menos un problema del caso y se puede demostrar en pantalla.
