# VIMO — Violeta Móvil

Asistente móvil para consultar cartas, personajes, enemigos e infraestructura de un juego. Cliente React Native + Expo SDK 57, API Node.js/Express/TypeScript y PostgreSQL.

**Estado:** implementación en desarrollo. El catálogo oficial está pendiente de entrega; los datos incluidos son demostraciones y se identifican como tales en la aplicación.

## Requisitos

- Node.js 24 y npm.
- Expo Go o un dispositivo/emulador compatible para probar el cliente.
- PostgreSQL, o Docker para iniciar la base de desarrollo, cuando se utilice `DATA_MODE=postgres`.

## Instalación

Desde la raíz:

```powershell
npm ci
npm ci --prefix server
Copy-Item .env.example .env
Copy-Item server/.env.example server/.env
```

## Probar sin base de datos

En `server/.env`, configurar `DATA_MODE=demo`. Mantener `CATALOG_STATUS=demo`.

```powershell
npm run server:build
npm run server:start
```

En otra terminal:

```powershell
npm start
```

La API se inicia en `http://127.0.0.1:3000`; su estado está en `/health`. El cliente utiliza `EXPO_PUBLIC_API_URL` y consume `/api/v1`.

En dispositivo físico, configurar `HOST=0.0.0.0` en `server/.env` y reemplazar `localhost` por la IP LAN del equipo en `.env`. Ambos dispositivos deben poder comunicarse. En el emulador Android estándar, el equipo anfitrión suele ser accesible mediante `10.0.2.2`. Reiniciar Expo al modificar la configuración y recargar el cliente.

Los valores `EXPO_PUBLIC_*` se incluyen en el cliente: no deben contener contraseñas ni secretos. Para acceso fuera del entorno local se requiere una API desplegada con HTTPS.

## PostgreSQL

La configuración de ejemplo corresponde al servicio local de `compose.yaml`. Sus credenciales son exclusivamente de desarrollo.

```powershell
docker compose up -d postgres
npm --prefix server run db:migrate
```

Configurar `DATA_MODE=postgres` en `server/.env` e iniciar el backend. Las migraciones crean el esquema sin añadir contenido ficticio.

Para cargar ejemplos expresamente en una base de desarrollo:

```powershell
npm --prefix server run db:seed:demo
```

La carga es transaccional y no reemplaza identificadores existentes. No debe utilizarse en una base destinada al catálogo oficial. Mantener `CATALOG_STATUS=demo` mientras se utilicen ejemplos. Cambiarlo a `approved` únicamente después de incorporar y validar el catálogo oficial completo.

En modo PostgreSQL, los fallos de la base de datos producen errores; no se reemplazan por ejemplos. `DATA_MODE=demo` está prohibido cuando `NODE_ENV=production`.

## Verificación

```powershell
npm run lint
npm run typecheck
npm test
npm run server:test
```

Las pruebas del servidor levantan un puerto HTTP local temporal. El caso PostgreSQL se omite si no está configurada `VIMO_TEST_DATABASE_URL`. Para ejecutarlo, utilizar una base independiente de pruebas: crea tablas y añade/elimina únicamente registros de prueba con identificadores propios.

El flujo `.github/workflows/checks.yml` prepara PostgreSQL y ejecuta estas verificaciones en GitHub Actions cuando los cambios se suban. La existencia del flujo no implica que ya haya sido ejecutado en GitHub.

## Organización y arquitectura

Los estilos se centralizan en `src/theme/` y los botones comunes utilizan `AppButton`. Consultar las [reglas de estilos](docs/ESTILOS.md) antes de añadir o modificar componentes visuales.

El inicio ofrece **Base de datos de cartas** y **Archivos lore**. La consulta rápida permite introducir el ID de cuatro dígitos de PC y abrir el efecto y las estadísticas de la carta. Ver los [recorridos de usuario](docs/RECORRIDOS_USUARIO.md). En modo demo se pueden probar los códigos `0001` a `0006`.

- `src/app/`: rutas de Expo Router.
- `src/views/`: pantallas y presentación.
- `src/controllers/`: coordinación de consultas del cliente.
- `src/models/`: validación y representación de entidades.
- `src/services/`: API, caché en memoria y almacenamiento persistente.
- `server/src/controllers/`: controladores HTTP.
- `server/src/repositories/`: consultas parametrizadas y modo demo explícito.
- `server/src/config/database.ts`: singleton por proceso con pool PostgreSQL.
- `server/src/data/`: esquema, instalación y ejemplos.

El cliente consume el contrato `{ success, data, pagination?, meta }`, descarga todas las páginas del catálogo de cartas y permite buscar localmente por nombre, tipo, descripción, efecto y etiquetas, sin distinguir mayúsculas ni acentos.

La caché mantiene cuatro catálogos por servidor, caduca a los cinco minutos y conserva la última respuesta válida para fallos de red. La actualización manual fuerza una solicitud. Se identifican datos guardados, respuestas de respaldo y demostraciones. Las solicitudes simultáneas al mismo catálogo se deduplican; las búsquedas no crean entradas persistentes adicionales. El almacenamiento está limitado a 24 entradas y 2 MiB estimados por entrada; las entradas mayores solo permanecen en memoria. Las versiones previas de caché se ignoran mediante un prefijo versionado.

## Publicación y versiones

`package.json`, `app.json` y el backend declaran `0.1.0`. Se incluyen perfiles EAS `preview` y `production`. Antes de compilar, asociar el proyecto a una cuenta Expo y configurar los identificadores definitivos de Android/iOS y una URL de API accesible. No se han creado builds ni publicado versiones.

Seguir [Git Flow y SemVer](docs/VERSIONAMIENTO.md). Consultar el [contrato de API](docs/API_CONTRACT.md), el [plan](PLAN_IMPLEMENTACION_VIMO.md) y el [estado de implementación](docs/AVANCES.md).

## Documentación técnica consultada

- [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/).
- [Variables de entorno en Expo](https://docs.expo.dev/guides/environment-variables/).
- [Navegación con Expo Router](https://docs.expo.dev/router/basics/navigation/).
- [Pool de node-postgres](https://node-postgres.com/features/pooling).
