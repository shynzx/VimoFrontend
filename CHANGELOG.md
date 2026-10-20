# Registro de cambios

## Sin publicar

- Propiedades de los modelos y de las clases en español (`carta.nombre`, `carta.codigoJuego`, `resultado.datos`, `entrada.secciones`…), renombradas con el servicio de lenguaje de TypeScript. La caché pasa a `@vimo_cache:v5:`.
- Rutas de la app en español: `/inicio`, `/cartas`, `/cartas/[id]`, `/guia` y `/guia/[tipo]/[id]` con `tipo` = `personajes`, `enemigos` o `infraestructura`.
- Contrato de API en español: rutas `/api/v1/cartas`, `/personajes`, `/enemigos`, `/infraestructura`; parámetros `busqueda`, `categoria`, `pagina` y `limite`; envoltorio `{ exito, datos, paginacion?, meta }` y campos como `nombre`, `codigoJuego` o `nivelMaximo`. Los modelos de la app conservan sus propiedades en inglés.
- Clases, métodos, funciones y componentes renombrados al español (`ServicioApi.obtenerCartas`, `ControladorCartas.buscarCartas`, `PantallaCartas`…), con sus archivos.
- La caché guarda los registros tal como los envía la API y pasa a `@vimo_cache:v4:`.
- Diseño del Figma "Wireframes - After Light": tema oscuro, fuentes Rajdhani, Inter e IBM Plex Mono, iconos Lucide e imágenes descargadas del Figma.
- Nuevas pantallas: portada, panel "Centro táctico", consulta por código con teclado numérico propio, detalle de carta y perfil del Archivo de lore. Las pilas de Cartas y Lore mantienen activa su pestaña en los detalles.
- Modelo del catálogo real del GDD: cartas con `category`, `effect` por nivel, `availability` y `maxLevel`; personajes con `alias`, `abilities` y `weaknesses`; enemigos con `behavior` y `weaknesses`; lugares con `gameplay`. El código de cuatro dígitos se deriva de `CAR-013` si el servidor no lo envía y la búsqueda acepta ambos formatos.
- Contrato de API actualizado para el backend .NET; se eliminan los datos de demostración del cliente y la caché pasa a `@vimo_cache:v3:`.
- Se elimina la API Node/Express (`server/`), su base PostgreSQL de desarrollo (`compose.yaml`), los scripts `server:*` y sus pasos de CI. La API pasa a ser el backend .NET (VimoBackend).

## 0.1.0

- Tema compartido para colores, tipografía, espaciado, superficies y navegación.
- Botones reutilizables con variantes y estados accesibles; estilos consistentes en todas las pantallas y modales.

- Pantalla de inicio con accesos a Base de datos de cartas y Archivos lore.
- Consulta exacta por ID visible de cuatro dígitos, teclado numérico, conservación de ceros y apertura rápida del detalle.
- Campo gameId del catálogo, con columna PostgreSQL opcional y única para incorporar los códigos oficiales sin alterar las relaciones internas.

- API MVC ejecutable con catálogos y detalles de cartas, personajes, enemigos e infraestructura.
- Singleton de PostgreSQL con pool de conexiones y esquema instalable.
- Modo demo explícito mientras se prepara el catálogo oficial.
- Integración móvil con el contrato de API y paginación de cartas.
- Validación de entidades, búsquedas por tipo y normalización de acentos en el cliente.
- Caché persistente, límites de almacenamiento, respaldo ante fallos y actualización manual.
- Avisos de contenido guardado y demostración; protección frente a respuestas de búsqueda antiguas.
- Detalles de cartas accesibles desde las relaciones de la guía mediante Expo Router.
- Pruebas del cliente y API; prueba PostgreSQL configurable y flujo de integración continua.
- Documentación de instalación, contrato, avances y versionamiento.

No representa una versión publicada. Falta el catálogo oficial y la validación final con PostgreSQL, Android e iOS.
