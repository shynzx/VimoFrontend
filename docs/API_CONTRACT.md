# Contrato de API de VIMO (v1)

Implementación de referencia: backend ASP.NET Core + SQL Server (repositorio `VimoBackend`). Las rutas, los parámetros y los nombres del JSON están en español.

## URL base
`/api/v1`

## Catálogo

El catálogo proviene del GDD de AfterLight y se carga con las migraciones del backend:

- **Cartas:** hoja "Cartas de mejora" de `AfterLight_Stats.xlsx` (21 cartas, `CAR-001` a `CAR-021`).
- **Personajes:** `03 - Historia y Mundo/03 - Personajes.md`.
- **Enemigos:** `04 - Contenido/03 - Enemigos y NPC.md`.
- **Infraestructura:** tabla "Lugares" de `03 - Historia y Mundo/02 - Mundo.md`.

No se publica el contenido que el GDD marca como interno (dirigentes de Cerberus, Consejo, "Información reservada"), ni los finales o las peticiones de Issac.

Las respuestas bajo `/api/v1` incluyen `meta: { "demo": true | false }`. Es `true` mientras `Vimo:EstadoCatalogo` no sea `approved`; el cliente muestra entonces un aviso.

`GET /salud` responde `{ "exito": true, "datos": { "baseDatos": "conectada" } }`, o HTTP 503 con `"baseDatos": "desconectada"` si SQL Server no está disponible.

## Códigos de carta

Cada carta tiene dos identificadores:

- `id`: ID del diseño, por ejemplo `"CAR-013"`. Clave para detalles y relaciones (`cartasRelacionadas`).
- `codigoJuego`: código de cuatro dígitos que el jugador escribe en la app, por ejemplo `"0013"`. Se deriva del número de la carta y conserva los ceros iniciales.

`GET /api/v1/cartas?busqueda=` interpreta `busqueda` así:

| `busqueda` | Búsqueda |
| --- | --- |
| Solo dígitos (`0013`) | `codigoJuego` exacto; `013` no encuentra `0013`. |
| `CAR-` + 3 dígitos (`car-013`) | `id` exacto, sin distinguir mayúsculas. |
| Cualquier otro texto | Coincidencia parcial en `nombre`, `efecto` y `categoria`, sin distinguir mayúsculas. |

## Formato de respuestas

Todas las respuestas son JSON (`Content-Type: application/json; charset=utf-8`). Los campos opcionales sin valor se omiten.

```json
{
  "exito": true,
  "datos": [ ... ],
  "paginacion": { "pagina": 1, "limite": 20, "total": 21, "totalPaginas": 2 },
  "meta": { "demo": false }
}
```

```json
{
  "exito": false,
  "error": { "codigo": "SOLICITUD_INVALIDA", "mensaje": "Descripción del error" },
  "meta": { "demo": false }
}
```

Códigos de error: `SOLICITUD_INVALIDA` (400), `NO_ENCONTRADO` (404, también para rutas inexistentes) y `SERVICIO_NO_DISPONIBLE` (503). Las respuestas de error fuera de `/api/v1` no incluyen `meta`.

---

## Endpoints

### Cartas

#### `GET /api/v1/cartas`

- `busqueda` (opcional, hasta 200 caracteres): ver "Códigos de carta".
- `categoria` (opcional, hasta 64 caracteres): categoría exacta sin distinguir mayúsculas: `Supervivencia`, `Batería`, `Linterna`, `Combate`, `Movimiento` o `Interacción`.
- `pagina` (entero de 1 a 1 000 000, por defecto 1) y `limite` (entero de 1 a 100, por defecto 20).

Valores inválidos o parámetros repetidos producen HTTP 400. Las cartas se ordenan por `id`. El cliente descarga todas las páginas y busca localmente.

```json
{
  "id": "CAR-013",
  "codigoJuego": "0013",
  "nombre": "Gatillo optimizado",
  "categoria": "Combate",
  "efecto": "+10% de la cadencia base del arma equipada.",
  "disponibilidad": "Tienda y UI",
  "nivelMaximo": 4,
  "actualizadoEn": "2026-10-20T00:00:00.000Z"
}
```

`efecto` describe un nivel; cada compra o elección sube un nivel hasta `nivelMaximo` y los efectos se acumulan de forma aditiva.

#### `GET /api/v1/cartas/:id`

Detalle por `id` (`CAR-013`). HTTP 404 si no existe.

### Personajes

#### `GET /api/v1/personajes` · `GET /api/v1/personajes/:id`

```json
{
  "id": "nicolas-varela",
  "nombre": "Nicolás Varela",
  "alias": "Enlace",
  "rol": "Operador de comunicaciones de Cerberus",
  "descripcion": "Aspecto y personalidad.",
  "habilidades": "Coordinación operativa, lectura de reportes y comunicación de procedimientos.",
  "debilidades": ["Depende de los canales disponibles"],
  "historia": "Papel en la historia.",
  "cartasRelacionadas": [],
  "actualizadoEn": "2026-10-20T00:00:00.000Z"
}
```

`alias` y `habilidades` son opcionales.

### Enemigos

#### `GET /api/v1/enemigos` · `GET /api/v1/enemigos/:id`

```json
{
  "id": "quimera",
  "nombre": "Quimera",
  "tipo": "Enemigo regular",
  "descripcion": "Rol de combate.",
  "comportamiento": "Comportamiento y ataques.",
  "debilidades": ["Movimiento ordinario lento"],
  "historia": "Aspecto.",
  "cartasRelacionadas": ["CAR-008", "CAR-009", "CAR-010", "CAR-011"],
  "actualizadoEn": "2026-10-20T00:00:00.000Z"
}
```

`dificultad` (`Baja`, `Media` o `Alta`) y `comportamiento` son opcionales; la dificultad se omite mientras el balance esté por definir.

### Infraestructura

#### `GET /api/v1/infraestructura` · `GET /api/v1/infraestructura/:id`

```json
{
  "id": "sectores-energia",
  "nombre": "Sectores de energía y mantenimiento",
  "tipo": "Sector",
  "ubicacion": "Centro científico",
  "descripcion": "Áreas que albergan generadores y equipos de servicio.",
  "funcionJugable": "Reparación y defensa de infraestructura.",
  "historia": "Explican la dependencia de la energía y la pérdida de iluminación.",
  "actualizadoEn": "2026-10-20T00:00:00.000Z"
}
```

`ubicacion` y `funcionJugable` son opcionales.

## Correspondencia con el código

Los nombres del JSON coinciden con las propiedades de los modelos, en español en ambos proyectos: en C# los DTO (`Dtos/DtosCatalogo.cs`) se serializan en camelCase, y en la app `ModeloCarta` y `ModeloGuia` (`src/models/`) validan cada registro. Las clases, los métodos y las propiedades están en español.
