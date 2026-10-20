# Contrato de API de VIMO (v1)

## Base URL
`/api/v1`

## Identificador visible de cartas

Las cartas pueden incluir `gameId`, una cadena de exactamente cuatro dígitos, por ejemplo `"0001"`. Corresponde al ID mostrado en el juego de PC y conserva sus ceros iniciales. `id` sigue siendo la clave interna para detalles y relaciones. El catálogo oficial deberá proporcionar estos códigos; los ejemplos incluyen códigos de demostración.

`GET /api/v1/cards?q=0001` busca el código exacto cuando `q` contiene solo dígitos; no realiza coincidencias parciales por código. Ejecutar `db:migrate` en bases existentes para añadir la columna nullable `game_id` y su índice único. Los registros anteriores no reciben códigos inventados y continúan accesibles mediante búsqueda textual.

## Estado del catálogo y disponibilidad

El catálogo oficial sigue pendiente de entrega. Los ejemplos de este documento y del código no deben considerarse información validada del juego.

Las respuestas bajo `/api/v1` incluyen `meta: { "demo": true | false }`. Este indicador es verdadero en `DATA_MODE=demo` o mientras `CATALOG_STATUS` no sea `approved`, incluso cuando se consulta PostgreSQL. El cliente muestra el aviso de demostración y conserva esa marca en la caché.

`GET /health` informa el modo de datos y el estado de PostgreSQL. Devuelve HTTP 503 si la base no está disponible en modo PostgreSQL; en modo demo informa que la base está deshabilitada. Los fallos de PostgreSQL no activan el modo demo automáticamente.

## Formato de Respuestas

Todas las respuestas exitosas devuelven formato JSON con encabezado `Content-Type: application/json; charset=utf-8`.

### Estructura de Respuesta Estándar
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### Estructura de Error Estándar
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Descripción detallada del error"
  }
}
```

---

## Endpoints

### 1. Cartas

#### `GET /api/v1/cards`
Lista cartas con soporte de búsqueda y paginación.

- **Query Parameters**:
  - `q` (string, opcional): Término de búsqueda (busca en `name`, `description`, `effect` y `tags`). Búsqueda insensible a mayúsculas.
  - `type` (string, opcional): Filtrar por tipo (ej. `Ataque`, `Defensa`, `Hechizo`, `Especial`).
  - `page` (number, opcional, por defecto `1`): Número de página.
  - `limit` (number, opcional, por defecto `20`, máx `100`): Cantidad de elementos por página.

`page` debe ser un entero entre 1 y 1 000 000, y `limit` entre 1 y 100. Los valores inválidos producen HTTP 400. `q` admite hasta 200 caracteres y `type` hasta 64; no se admiten valores repetidos para estos filtros. El cliente descarga todas las páginas de cartas y aplica adicionalmente una búsqueda local sin distinguir acentos, incluyendo el tipo.

- **Respuesta 200 OK**:
```json
{
  "success": true,
  "data": [
    {
      "id": "card-01",
      "name": "Golpe Violeta",
      "type": "Ataque",
      "cost": 2,
      "rarity": "Común",
      "effect": "Inflige 15 de daño y aplica Vulnerabilidad durante 1 turno.",
      "description": "Una descarga de energía violeta canalizada a través del núcleo del avatar.",
      "tags": ["ataque", "violeta", "vulnerabilidad"],
      "updatedAt": "2026-10-15T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

#### `GET /api/v1/cards/:id`
Obtiene los detalles completos de una carta específica.

- **Parámetros de ruta**: `id` (string)
- **Respuesta 200 OK**:
```json
{
  "success": true,
  "data": {
    "id": "card-01",
    "name": "Golpe Violeta",
    "type": "Ataque",
    "cost": 2,
    "rarity": "Común",
    "effect": "Inflige 15 de daño y aplica Vulnerabilidad durante 1 turno.",
    "description": "Una descarga de energía violeta canalizada a través del núcleo del avatar.",
    "tags": ["ataque", "violeta", "vulnerabilidad"],
    "updatedAt": "2026-10-15T00:00:00.000Z"
  }
}
```
- **Respuesta 404 Not Found**:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Carta con id 'card-999' no encontrada."
  }
}
```

---

### 2. Personajes

#### `GET /api/v1/characters`
Lista los personajes principales y de apoyo.

- **Respuesta 200 OK**:
```json
{
  "success": true,
  "data": [
    {
      "id": "char-01",
      "name": "Violeta",
      "role": "Protagonista / Estratega",
      "description": "Líder de la resistencia contra la distorsión del Velo.",
      "lore": "Nacida en la ciudadela de Neón, descubrió su habilidad para sintonizar los fragmentos violeta a temprana edad.",
      "relatedCards": ["card-01", "card-03"],
      "updatedAt": "2026-10-15T00:00:00.000Z"
    }
  ]
}
```

#### `GET /api/v1/characters/:id`
Obtiene el detalle completo de un personaje.

---

### 3. Enemigos

#### `GET /api/v1/enemies`
Lista las entidades hostiles y jefes.

- **Respuesta 200 OK**:
```json
{
  "success": true,
  "data": [
    {
      "id": "enemy-01",
      "name": "Centinela Carmesí",
      "type": "Mecánico Autómata",
      "difficulty": "Media",
      "description": "Guardián blindado del sector perimetral.",
      "lore": "Construido durante la Gran Fractura para vigilar las torres de resonancia.",
      "relatedCards": ["card-02"],
      "updatedAt": "2026-10-15T00:00:00.000Z"
    }
  ]
}
```

#### `GET /api/v1/enemies/:id`
Obtiene el detalle completo de un enemigo.

---

### 4. Infraestructura

#### `GET /api/v1/infrastructure`
Lista las instalaciones, zonas y nodos del juego.

- **Respuesta 200 OK**:
```json
{
  "success": true,
  "data": [
    {
      "id": "infra-01",
      "name": "Torre de Resonancia Alpha",
      "type": "Instalación Energética",
      "location": "Sector Central - Sector 4",
      "description": "Estructura principal que estabiliza el flujo del Velo.",
      "lore": "El núcleo emite un zumbido constante que alimenta las matrices defensivas de la ciudadela.",
      "updatedAt": "2026-10-15T00:00:00.000Z"
    }
  ]
}
```

#### `GET /api/v1/infrastructure/:id`
Obtiene el detalle completo de una instalación.
