# Contrato de API de VIMO (v1)

Implementación de referencia: backend ASP.NET Core + SQL Server (repositorio `VimoBackend`).

## Base URL
`/api/v1`

## Catálogo

El catálogo proviene del GDD de AfterLight y se carga con las migraciones del backend:

- **Cartas:** hoja "Cartas de mejora" de `AfterLight_Stats.xlsx` (21 cartas, `CAR-001` a `CAR-021`).
- **Personajes:** `03 - Historia y Mundo/03 - Personajes.md`.
- **Enemigos:** `04 - Contenido/03 - Enemigos y NPC.md`.
- **Infraestructura:** tabla "Lugares" de `03 - Historia y Mundo/02 - Mundo.md`.

No se publica el contenido que el GDD marca como interno (dirigentes de Cerberus, Consejo, "Información reservada"), ni los finales o las peticiones de Issac.

Las respuestas bajo `/api/v1` incluyen `meta: { "demo": true | false }`. Es `true` mientras `Vimo:CatalogStatus` no sea `approved`; el cliente muestra entonces un aviso. No existe modo de datos de demostración: la API siempre consulta SQL Server.

`GET /health` responde `{ "success": true, "data": { "database": "up" } }`, o HTTP 503 con `"database": "down"` si SQL Server no está disponible.

## Códigos de carta

Cada carta tiene dos identificadores:

- `id`: ID del diseño, por ejemplo `"CAR-013"`. Clave para detalles y relaciones (`relatedCards`).
- `gameId`: código de cuatro dígitos que el jugador escribe en la app, por ejemplo `"0013"`. Se deriva del número de la carta y conserva los ceros iniciales.

`GET /api/v1/cards?q=` interpreta `q` así:

| `q` | Búsqueda |
| --- | --- |
| Solo dígitos (`0013`) | `gameId` exacto; `013` no encuentra `0013`. |
| `CAR-` + 3 dígitos (`car-013`) | `id` exacto, sin distinguir mayúsculas. |
| Cualquier otro texto | Coincidencia parcial en `name`, `effect` y `category`, sin distinguir mayúsculas. |

## Formato de respuestas

Todas las respuestas son JSON (`Content-Type: application/json; charset=utf-8`). Los campos opcionales sin valor se omiten.

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": { "page": 1, "limit": 20, "total": 21, "totalPages": 2 },
  "meta": { "demo": false }
}
```

```json
{
  "success": false,
  "error": { "code": "BAD_REQUEST", "message": "Descripción del error" },
  "meta": { "demo": false }
}
```

Códigos de error: `BAD_REQUEST` (400), `NOT_FOUND` (404, también para rutas inexistentes) y `SERVICE_UNAVAILABLE` (503).

---

## Endpoints

### Cartas

#### `GET /api/v1/cards`

- `q` (opcional, hasta 200 caracteres): ver "Códigos de carta".
- `category` (opcional, hasta 64 caracteres): categoría exacta sin distinguir mayúsculas: `Supervivencia`, `Batería`, `Linterna`, `Combate`, `Movimiento` o `Interacción`.
- `page` (entero de 1 a 1 000 000, por defecto 1) y `limit` (entero de 1 a 100, por defecto 20).

Valores inválidos o parámetros repetidos producen HTTP 400. Las cartas se ordenan por `id`. El cliente descarga todas las páginas y busca localmente.

```json
{
  "id": "CAR-013",
  "gameId": "0013",
  "name": "Gatillo optimizado",
  "category": "Combate",
  "effect": "+10% de la cadencia base del arma equipada.",
  "availability": "Tienda y UI",
  "maxLevel": 4,
  "updatedAt": "2026-10-20T00:00:00.000Z"
}
```

`effect` describe un nivel; cada compra o elección sube un nivel hasta `maxLevel` y los efectos se acumulan de forma aditiva.

#### `GET /api/v1/cards/:id`

Detalle por `id` (`CAR-013`). HTTP 404 si no existe.

### Personajes

#### `GET /api/v1/characters` · `GET /api/v1/characters/:id`

```json
{
  "id": "nicolas-varela",
  "name": "Nicolás Varela",
  "alias": "Enlace",
  "role": "Operador de comunicaciones de Cerberus",
  "description": "Aspecto y personalidad.",
  "abilities": "Coordinación operativa, lectura de reportes y comunicación de procedimientos.",
  "weaknesses": ["Depende de los canales disponibles"],
  "lore": "Papel en la historia.",
  "relatedCards": [],
  "updatedAt": "2026-10-20T00:00:00.000Z"
}
```

`alias` y `abilities` son opcionales.

### Enemigos

#### `GET /api/v1/enemies` · `GET /api/v1/enemies/:id`

```json
{
  "id": "quimera",
  "name": "Quimera",
  "type": "Enemigo regular",
  "description": "Rol de combate.",
  "behavior": "Comportamiento y ataques.",
  "weaknesses": ["Movimiento ordinario lento"],
  "lore": "Aspecto.",
  "relatedCards": ["CAR-008", "CAR-009", "CAR-010", "CAR-011"],
  "updatedAt": "2026-10-20T00:00:00.000Z"
}
```

`difficulty` (`Baja`, `Media` o `Alta`) y `behavior` son opcionales; la dificultad se omite mientras el balance esté por definir.

### Infraestructura

#### `GET /api/v1/infrastructure` · `GET /api/v1/infrastructure/:id`

```json
{
  "id": "sectores-energia",
  "name": "Sectores de energía y mantenimiento",
  "type": "Sector",
  "location": "Centro científico",
  "description": "Áreas que albergan generadores y equipos de servicio.",
  "gameplay": "Reparación y defensa de infraestructura.",
  "lore": "Explican la dependencia de la energía y la pérdida de iluminación.",
  "updatedAt": "2026-10-20T00:00:00.000Z"
}
```

`location` y `gameplay` son opcionales.
