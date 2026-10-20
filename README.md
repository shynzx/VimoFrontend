# VIMO — Violeta Móvil

Aplicación de consulta para jugadores de **AfterLight**: cartas de mejora, personajes, enemigos y lugares del juego. Cliente React Native + Expo SDK 57. La API es el backend ASP.NET Core + SQL Server del repositorio [VimoBackend](https://github.com/GaelGrezz/VimoBackend).

**Estado:** en desarrollo. El catálogo proviene del GDD de AfterLight y lo carga el backend con sus migraciones. El diseño sigue el Figma "Wireframes - After Light" ([estilos](docs/ESTILOS.md)).

## Requisitos

- Node.js 24 y npm.
- Expo Go o un dispositivo/emulador compatible.
- El backend VimoBackend en ejecución: .NET 10 SDK y SQL Server (LocalDB basta en desarrollo).

## Instalación

```powershell
npm ci
Copy-Item .env.example .env
```

`.env` define `EXPO_PUBLIC_API_URL`, por defecto `http://localhost:3000/api/v1`.

## Ejecutar

1. En el repositorio **VimoBackend**, aplicar las migraciones (crean el esquema y cargan el catálogo) e iniciar la API en el puerto 3000:

   ```powershell
   dotnet tool restore
   dotnet ef database update
   dotnet run --launch-profile http
   ```

   El estado de la API está en `http://localhost:3000/health`.

2. En este repositorio:

   ```powershell
   npm start
   ```

   Para la versión web, `npm run web` (puerto 8081). En desarrollo el backend permite CORS desde `http://localhost:8081` (`Vimo:WebOrigin`).

En un dispositivo físico, reemplazar `localhost` por la IP LAN del equipo en `.env`, y lanzar la API escuchando en esa interfaz (por ejemplo `dotnet run --launch-profile http --urls http://0.0.0.0:3000`). En el emulador Android estándar, el equipo anfitrión suele ser accesible en `10.0.2.2`. Reiniciar Expo después de modificar `.env`.

Los valores `EXPO_PUBLIC_*` se incluyen en el cliente: no deben contener contraseñas ni secretos. Fuera del entorno local se requiere una API desplegada con HTTPS.

## Verificación

```powershell
npm run lint
npm run typecheck
npm test
```

Las pruebas ejecutan los servicios reales del cliente (`ApiService`, `CacheService`) con red y almacenamiento simulados. El flujo `.github/workflows/checks.yml` ejecuta las mismas verificaciones en GitHub Actions. Las pruebas de la API viven en VimoBackend.

## Organización y arquitectura

Recorrido principal: **portada → Centro táctico → Base de datos de cartas** (código de cuatro dígitos con teclado numérico, por ejemplo `0013`) **→ detalle de la carta**. El **Archivo de lore** lista personajes, enemigos y lugares, y abre su perfil con enlaces a las cartas relacionadas. Ver los [recorridos de usuario](docs/RECORRIDOS_USUARIO.md).

- `src/app/`: rutas de Expo Router. `index.tsx` es la portada; `(tabs)/` contiene las pestañas Inicio, Cartas y Lore, con pilas propias para los detalles.
- `src/views/`: pantallas y presentación.
- `src/controllers/`: coordinación de consultas del cliente.
- `src/models/`: validación y representación de entidades (`LoreEntry` unifica la presentación del archivo de lore).
- `src/services/`: API, caché en memoria y almacenamiento persistente.
- `src/components/` y `src/theme/`: componentes y sistema visual compartidos.

El cliente consume el contrato `{ success, data, pagination?, meta }` ([contrato de API](docs/API_CONTRACT.md)), descarga todas las páginas del catálogo de cartas y busca localmente por código (`0013` o `CAR-013`) o por nombre, categoría y efecto, sin distinguir mayúsculas ni acentos.

La caché mantiene cuatro catálogos por servidor, caduca a los cinco minutos y conserva la última respuesta válida ante fallos de red. Las solicitudes simultáneas al mismo catálogo se deduplican. El almacenamiento está limitado a 24 entradas y 2 MiB estimados por entrada; las entradas mayores solo permanecen en memoria. Las versiones previas de la caché se ignoran mediante un prefijo versionado.

## Publicación y versiones

`package.json` y `app.json` declaran `0.1.0`. Se incluyen perfiles EAS `preview` y `production`. Antes de compilar, asociar el proyecto a una cuenta Expo y configurar los identificadores definitivos de Android/iOS y una URL de API accesible. No se han creado builds ni publicado versiones.

Seguir [Git Flow y SemVer](docs/VERSIONAMIENTO.md). Consultar también el [plan](PLAN_IMPLEMENTACION_VIMO.md) y el [estado de implementación](docs/AVANCES.md).

## Documentación técnica consultada

- [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/).
- [Variables de entorno en Expo](https://docs.expo.dev/guides/environment-variables/).
- [Navegación con Expo Router](https://docs.expo.dev/router/basics/navigation/).
- [Fuentes en Expo](https://docs.expo.dev/develop/user-interface/fonts/).
