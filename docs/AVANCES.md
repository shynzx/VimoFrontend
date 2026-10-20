# Estado de implementación de VIMO

## Revisión y avances

VIMO se compone de dos repositorios: este cliente Expo y la API de [VimoBackend](https://github.com/GaelGrezz/VimoBackend), construida con ASP.NET Core y SQL Server. La API anterior en Node/Express con PostgreSQL se retiró; el backend .NET es la única implementación vigente del [contrato de API](API_CONTRACT.md).

El catálogo ya no usa datos de ejemplo: proviene del GDD de AfterLight y lo carga la migración `RealCatalog` del backend. El diseño del cliente sigue el Figma "Wireframes - After Light" ([estilos](ESTILOS.md)).

| Área | Estado actual | Pendiente |
| --- | --- | --- |
| React Native + Expo | Cliente en SDK 57, Expo Router y versiones alineadas en 0.1.0. | Pruebas en dispositivos Android e iOS. |
| Diseño | Tema oscuro del Figma "Wireframes - After Light": portada, Centro táctico, teclado numérico propio, detalle de carta y perfil del Archivo de lore. | Ilustraciones de cartas y retratos de personajes, enemigos y lugares. |
| Cartas | Consulta por código de cuatro dígitos derivado del ID (`CAR-013` → `0013`; también se acepta `CAR-013`) y detalle con categoría, efecto por nivel, nivel máximo y disponibilidad. | Escaneo del código con la cámara. |
| Archivo de lore | Pestañas Personajes, Enemigos y Lugares; perfil por secciones y enlaces a las cartas relacionadas. | Revisión visual en dispositivos. |
| MVC | Vistas, controladores y modelos del cliente conectados; controladores y repositorios del backend separados. | Revisión final de arquitectura con el equipo. |
| API | ASP.NET Core con rutas de catálogo y detalle, envoltorio `{ success, data, pagination?, meta }`, validación de parámetros, errores JSON y `GET /health`. | Despliegue con HTTPS. |
| Base de datos | SQL Server (LocalDB en desarrollo) con Entity Framework Core; esquema y catálogo creados por migraciones. | Base de datos del entorno desplegado. |
| Contenido | Catálogo real de la migración `RealCatalog`: 21 cartas, 4 personajes, 3 enemigos y 7 lugares. Se excluye el contenido interno del GDD, los finales y las peticiones de Issac. | Mantener el catálogo al día con el GDD mediante nuevas migraciones. |
| Caché | Memoria y persistencia, TTL, límites, deduplicación, respaldo ante fallos, separación por servidor y validación de datos. | Medición en dispositivos. |
| Calidad | Pruebas automatizadas del cliente, lint y typecheck. | Proyecto de tests xUnit del backend y aceptación Android/iOS. |
| Git Flow y SemVer | Flujo documentado, changelog y configuración de CI preparada. | Subir cambios, ejecutar CI, configurar protecciones y crear una versión aprobada con etiqueta v. |
| EAS | Perfiles `preview` y `production` preparados. | Cuenta/proyecto Expo, identificadores definitivos, API accesible y builds. |

## Validación disponible

- Pruebas del cliente: las 10 pasan (`npm test`). Cubren paginación, búsqueda por código y por texto, caché entre sesiones, deduplicación, actualización, fallos de red y datos inválidos, con red y almacenamiento simulados.
- Lint de Expo (`npm run lint`) y TypeScript (`npm run typecheck`): aprobados.
- Backend: compila y se ha ejecutado contra LocalDB con las migraciones aplicadas, consumido por los servicios reales del cliente.

El backend todavía no tiene pruebas automatizadas. No se han validado builds ni interfaces en dispositivos, ni se han medido los objetivos de rendimiento del plan. Los tests de almacenamiento utilizan un adaptador simulado; no sustituyen la prueba del almacenamiento nativo en un dispositivo.

## Siguientes hitos

1. Probar los recorridos completos, teclado numérico, enlaces, áreas seguras y accesibilidad en Android e iOS.
2. Asociar EAS, configurar identificadores y entornos y generar builds de validación.
3. Añadir el escaneo del código de la carta con la cámara.
4. Incorporar las ilustraciones de las cartas y los retratos del Archivo de lore.
5. Crear el proyecto de tests xUnit del backend.
6. Desplegar la API con HTTPS y apuntar `EXPO_PUBLIC_API_URL` a ella.
7. Aprobar una release, registrar cambios y etiquetar la versión correspondiente.
