# Principios de arquitectura — BecaClara

> Documento de equipo. Complementa `docs/01-solucion-ifarhu.md` (qué problema resuelve) con el **cómo**: las decisiones de diseño concretas y por qué se tomaron así.

## Idea central

**Sacar la política pública del código y ponerla en datos versionados.** Todo lo demás en este documento se deriva de eso.

Significa que las reglas que definen quién recibe la beca y cuánto no están escritas dentro del programa, sino guardadas como datos que se pueden consultar y editar.

### El contraste

**Política dentro del código:**
```js
if (promedio >= 4.0) aprobar();
```
Cambia el decreto y baja el índice a 3.8 → hay que modificar el programa, probarlo, volverlo a instalar. Semanas de trabajo y un desarrollador de por medio.

**Política como dato versionado:**
```
Regla: índice_mínimo
Valor: 4.0
Vigente desde: 01/01/2025
Fundamento: Resolución 123
```
El programa solo pregunta "¿cuál es el índice mínimo vigente?" y aplica lo que encuentre. Cambia el decreto → un funcionario autorizado crea una versión nueva con el valor 3.8 y su fecha. El sistema sigue igual.

### Por qué importa

- **Velocidad.** El IFARHU responde a un cambio normativo en horas, no en meses.
- **Legitimidad.** La decisión de quién califica la toma la autoridad competente, no un programador interpretando un decreto.
- **Auditoría.** Cada expediente guarda con qué versión de la regla fue evaluado. Si en 2028 alguien pregunta por qué se rechazó un caso en 2026, la respuesta está ahí con su fundamento legal.

---

## Los siete principios

### 1. ID interno, no cédula, como llave primaria
La cédula se **valida** contra el Tribunal Electoral, pero no identifica a nivel de base de datos. Si se usa como llave primaria, cada corrección de documento (cédula mal digitada, cambio de estado civil, etc.) crea un registro duplicado en vez de corregir el existente. La llave primaria es un `id_interno` propio del sistema; la cédula es un atributo validado, no la clave.

### 2. Reglas en datos, no en código
Índice mínimo, montos, cupos y requisitos son registros versionados con fecha de vigencia (ver "Idea central"). Cambia el decreto → un funcionario carga la nueva versión. No se recompila nada.

### 3. Pago idempotente
Clave única por **beneficiario + convocatoria + periodo**. Si el proceso de pago corre dos veces (por reintento, por error del procesador externo, por lo que sea), el segundo intento se rechaza solo, por la restricción de unicidad de la base de datos — no porque alguien lo esté revisando a tiempo. El pago duplicado se elimina **por diseño**, no por control humano posterior. Esto es exactamente lo que habría evitado el error de $14M del PASE-U/Listo Wallet documentado en `docs/01-solucion-ifarhu.md`.

### 4. Bitácora append-only firmada. No blockchain
Cada evento de la bitácora se encadena con un hash del evento anterior, y la cadena lleva una firma institucional. Nadie puede editar ni borrar un evento pasado sin romper la cadena y que sea detectable.

**Por qué no blockchain:** blockchain resuelve el problema de desconfianza *entre partes que no se conocen ni confían entre sí* (por eso tiene sentido en criptomonedas). Aquí hay **una entidad rectora** (el IFARHU) con obligación legal de custodia de sus propios registros — no hace falta descentralizar la confianza, hace falta que esa entidad no pueda alterar su propio historial sin que se note. Un log encadenado y firmado logra eso con muchísima menos complejidad operativa que una blockchain.

### 5. Separación de funciones en tres roles
- **Quien registra** una solicitud no la aprueba.
- **Quien aprueba** no ejecuta la transferencia del pago.
- **Quien ejecuta el pago** no puede haber sido quien aprobó.

Esto es lo que el `README.md` actual llama "Roles básicos" y todavía no está implementado en la demo — este principio le da forma concreta: no son roles decorativos, son un control de separación de funciones (mismo principio que evita que una sola persona pueda aprobar y cobrar un auxilio irregular, como en el caso de $38M documentado en `docs/01-solucion-ifarhu.md`).

### 6. Ante inconsistencia: marcar, no bloquear
Cuando un dato no cuadra (ej. una validación externa tarda, un documento parece inconsistente pero no es concluyente), el sistema no rechaza de forma automática y definitiva. Pasa a un estado **"En revisión"**, notifica al estudiante, y muestra un plazo visible de subsanación.

Razón: dejar sin beca a quien sí califica por un falso positivo cuesta más — social y legalmente — que retener un pago dudoso unos días mientras se resuelve.

### 7. Transparencia en dos niveles
- **Portal público:** datos agregados, sin información personal (lo que ya existe en la demo actual).
- **Consulta individual autenticada:** el estudiante entra con su identidad y ve su propio estado y el motivo exacto de la decisión — no un dato agregado, sino su expediente.

---

## Qué cambia respecto al prototipo actual

| Mecanismo | Estado en la demo actual (`app.js`) | Ajuste según estos principios |
|---|---|---|
| Llave de duplicidad de solicitud | `nationalId + period` como clave de negocio | Pasar a `id_interno` autogenerado como llave primaria; `nationalId` queda como atributo validado, no como clave |
| Llave de duplicidad de pago | `applicationId + installment` | Redefinir como `beneficiario + convocatoria + periodo`, aplicada como restricción única en PostgreSQL, no solo verificada en JS |
| Bitácora | Arreglo en `localStorage`, sin protección técnica contra edición | Tabla append-only en PostgreSQL con hash encadenado + firma institucional |
| Estados de solicitud | Solo `APROBADA` / `NO_ELEGIBLE` | Agregar `EN_REVISIÓN` para inconsistencias no concluyentes, con notificación y plazo |
| Roles | Etiqueta visual estática ("Analista IFARHU") | Tres roles reales con permisos separados: registra / aprueba / ejecuta pago |
| Transparencia | Solo portal público agregado | Agregar consulta individual autenticada del propio expediente |
