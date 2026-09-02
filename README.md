# BecaClara — versión limpia

Proyecto universitario del **Caso 6: Sistema de Becas**. Está preparado para subirse directamente a un repositorio de GitHub y publicarse con GitHub Pages.

## Archivos

- `index.html`: estructura de la aplicación.
- `styles.css`: diseño responsive.
- `data.js`: datos ficticios iniciales.
- `app.js`: funcionamiento, validaciones y almacenamiento.
- `README.md`: documentación del proyecto.

No utiliza Node.js, React, bases de datos externas ni instalación de dependencias.

## Cómo abrirlo

Haz doble clic en `index.html`. También puedes usar Live Server en Visual Studio Code.

## Cómo subirlo a GitHub

1. Crea un repositorio vacío.
2. Sube estos cinco archivos en la raíz.
3. En GitHub entra a **Settings → Pages**.
4. Selecciona **Deploy from a branch**.
5. Escoge la rama `main` y la carpeta `/root`.

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

Prueba crear otra solicitud con la cédula `8-111-111`: el sistema la bloqueará por duplicidad y registrará el evento en Auditoría.

En Pagos, intenta pagar nuevamente la solicitud de María González: el pago duplicado será bloqueado.

## Persistencia de la demostración

Los cambios se guardan en `localStorage`, es decir, dentro del navegador utilizado para la demostración. En Auditoría puedes presionar **Restablecer demo** para volver a los datos originales.

## Alcance

Es un prototipo académico. Las consultas a MEDUCA, Tribunal Electoral y bancos están simuladas. No utiliza estudiantes, pagos ni credenciales reales.
