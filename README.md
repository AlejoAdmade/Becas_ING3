# BecaClara

Proyecto del **Caso 6: Sistema de Becas**

## Archivos

- `index.html`: estructura de la aplicación.
- `styles.css`: diseño responsive.
- `data.js`: datos ficticios iniciales.
- `app.js`: funcionamiento, validaciones y almacenamiento.
- `README.md`: documentación del proyecto.


## Funciones demostrables

- Dashboard con indicadores.
- Creación y evaluación automática de solicitudes.
- Rechazos con explicación exacta.
- Detección de solicitudes duplicadas.
- Políticas versionadas y configurables.
- Cambio de promedio, asistencia y montos sin modificar código.
- Pagos simulados.
- Bloqueo de pagos duplicados.
- Bitácora de auditoría.
- Portal de transparencia sin datos personales.
- Diseño adaptable a celular y computadora.

## Casos preparados

| Estudiante | Cédula | Resultado |
| --- | --- | --- |
| María González | `8-111-111` | Aprobada y con pago realizado |
| Carlos Pérez | `8-222-222` | No elegible por promedio |
| Ana Rodríguez | `8-333-333` | Aprobada |
| Luis Martínez | `4-444-444` | No elegible por asistencia |


## Persistencia de la demostración

Los cambios se guardan en `localStorage`, es decir, dentro del navegador utilizado para la demostración. En Auditoría puedes presionar **Restablecer demo** para volver a los datos originales.

## Alcance

Es un prototipo académico. Las consultas a MEDUCA, Tribunal Electoral y bancos están simuladas. No utiliza estudiantes, pagos ni credenciales reales.

## Planificación general del proyecto

El equipo ya tiene definido el alcance general del proyecto y su distribución en cuatro sprints. Esta planificación permite desarrollar BecaClara de manera progresiva, presentar avances funcionales desde el primer sprint y evitar intentar construir todo el sistema al mismo tiempo.

| Sprint | Enfoque principal | Estado |
| --- | --- | --- |
| Sprint 1 | Base funcional del sistema | En desarrollo |
| Sprint 2 | Gestión y revisión de expedientes | Planificado |
| Sprint 3 | Pagos, conciliación y controles | Planificado |
| Sprint 4 | Políticas avanzadas, pruebas y cierre | Planificado |

## Sprint 1 — Base funcional

El objetivo del primer sprint es contar con una versión demostrable que represente la idea central de BecaClara. En esta etapa no se intenta construir todo el sistema, sino completar el flujo principal de una solicitud.

Alcance definido:

- ✓ Repositorio GitHub.
- ✓ Login.
- ✓ Roles básicos.
- ✓ Base de datos.
- ✓ Dashboard.
- ✓ Estudiantes dummy.
- ✓ Crear solicitud.
- ✓ Ver solicitudes.
- ✓ Motor básico de reglas.
- ✓ Validación automática.
- ✓ Detección de duplicados.
- ✓ Auditoría básica.

Flujo que se utilizará en la presentación del Sprint 1:

```text
Login
  ↓
Crear estudiante
  ↓
Crear solicitud
  ↓
El sistema consulta la política vigente
  ↓
Evalúa los requisitos automáticamente
  ↓
APROBADO / RECHAZADO
  ↓
Muestra el motivo de la decisión
```

Con este flujo se demuestra que el sistema puede recibir una solicitud, consultar las reglas vigentes, evaluarla automáticamente, detectar inconsistencias y explicar claramente el resultado.

## Sprint 2 — Gestión de expedientes

El segundo sprint ampliará el proceso para permitir la intervención controlada de los funcionarios y el seguimiento completo del estudiante.

Alcance planificado:

- Documentos.
- Revisión por funcionario.
- Flujo de aprobación.
- Roles completos.
- Reconsideraciones.
- Historial del estudiante.
- Notificaciones.

## Sprint 3 — Pagos y controles financieros

El tercer sprint incorporará el proceso financiero simulado y los controles necesarios para prevenir errores y pagos duplicados.

Alcance planificado:

- Órdenes de pago.
- Pagos simulados.
- Control de duplicidades.
- Conciliación.
- Auditoría avanzada.
- Alertas.

## Sprint 4 — Políticas avanzadas y cierre

El cuarto sprint completará las funciones avanzadas, la calidad del sistema y la documentación final del proyecto.

Alcance planificado:

- Motor de políticas completo.
- Versionamiento de políticas.
- Simulación de políticas.
- Dashboard público.
- Reportería.
- Pruebas.
- Seguridad.
- Documentación.

## Resultado esperado al finalizar los sprints

Al terminar los cuatro sprints, BecaClara contará con un flujo completo de solicitudes, validaciones, revisión, aprobación, pagos simulados, auditoría, transparencia y adaptación a cambios de política pública. La planificación ya se encuentra definida; cada sprint incrementará las capacidades del sistema sin perder el funcionamiento alcanzado en los anteriores.
