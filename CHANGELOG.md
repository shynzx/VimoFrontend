# Registro de cambios

## Sin publicar — 0.1.0

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
