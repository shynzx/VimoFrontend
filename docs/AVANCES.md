# Estado de implementación de VIMO

## Revisión y avances

La revisión encontró mejoras previas en las pantallas, accesibilidad, detalles de entidades y almacenamiento persistente. También encontró un backend incompleto y una incompatibilidad entre el formato de respuesta de su contrato y el cliente.

Se continuó sobre esos cambios sin sustituir el trabajo existente. El catálogo oficial permanece pendiente: el responsable indicó que lo entregará cuando termine de prepararlo.

| Área | Estado actual | Pendiente |
| --- | --- | --- |
| React Native + Expo | Cliente en SDK 57, Expo Router y versiones alineadas en 0.1.0. | Pruebas en dispositivos. |
| Inicio | Accesos a Base de datos de cartas y Archivos lore. | Contrastar el diseño con las ilustraciones originales. |
| Cartas | Consulta exacta por ID visible de cuatro dígitos, preservando ceros; apertura del detalle; búsqueda textual adicional y actualización manual. | Códigos oficiales y aceptación funcional con usuarios. |
| Guía | Personajes, enemigos e infraestructura, detalles, listas virtualizadas y enlaces a cartas relacionadas. | Historia oficial y revisión visual móvil. |
| MVC | Vistas/controladores/modelos del cliente conectados; controladores y repositorios del backend separados. | Revisión final de arquitectura con el equipo. |
| API | Servidor ejecutable, ocho rutas de catálogo/detalle, errores JSON, validación de parámetros y endpoint de salud. | Despliegue HTTPS. |
| Base de datos | Singleton con pool, consultas parametrizadas, esquema y carga transaccional opcional de ejemplos. | Ejecución y verificación contra PostgreSQL real. |
| Caché | Memoria y persistencia, TTL, límites, deduplicación, respaldo ante fallos, separación por servidor y validación de datos. | Medición en dispositivos; evaluar mostrar caché caducada antes de completar la revalidación. |
| Contenido | Modo demo explícito, marca de demostración persistida y prohibición de ese modo en producción. | Incorporar y aprobar los datos reales antes de cambiar CATALOG_STATUS. |
| Calidad | Pruebas automatizadas del cliente, API HTTP e integración cliente/API; caso PostgreSQL preparado. | Prueba PostgreSQL local/CI y aceptación Android/iOS. |
| Git Flow y SemVer | Flujo documentado, changelog y configuración de CI preparada. | Subir cambios, ejecutar CI, configurar protecciones y crear una versión aprobada con etiqueta v. |
| EAS | Perfiles preview y production preparados. | Cuenta/proyecto Expo, identificadores definitivos, API accesible, builds y publicación. |

## Validación disponible

- TypeScript del cliente y compilación del backend: aprobados.
- Lint de Expo: aprobado sin errores ni advertencias.
- Exportación web con Expo: aprobada; salida local en `dist/verification` (ignorada por Git). La exportación comprueba el empaquetado, no la interacción visual ni una compilación nativa.
- Pruebas ejecutadas: 9 del cliente y 5 del backend/integración aprobadas; 1 de PostgreSQL omitida por falta de una base de pruebas configurada.
- Pruebas del cliente para paginación, búsqueda, caché entre sesiones, deduplicación, actualización, fallos y datos inválidos.
- Pruebas HTTP para catálogos, detalles, paginación, parámetros y modo demo.
- Pruebas de códigos completos, ceros iniciales, códigos inválidos y coincidencia exacta tanto en cliente como en la API de demostración.
- Integración de los servicios reales del cliente con la API local y respaldo sin conexión.
- El caso PostgreSQL se omite cuando no existe VIMO_TEST_DATABASE_URL; no equivale a una prueba aprobada contra PostgreSQL.
- El flujo de GitHub Actions incluye PostgreSQL, pero no se ha ejecutado remotamente en este trabajo.

No se han validado builds ni interfaces en dispositivos, ni se han medido los objetivos de rendimiento del plan. Los tests de almacenamiento utilizan un adaptador simulado; no sustituyen la prueba del almacenamiento nativo en un dispositivo.

## Siguientes hitos

1. Configurar una base de pruebas PostgreSQL y ejecutar la prueba de integración o subir los cambios para ejecutar CI.
2. Probar los recorridos completos, modales, enlaces, teclado, áreas seguras y accesibilidad en Android e iOS.
3. Recibir el catálogo oficial, validar identificadores y relaciones e incorporarlo sin los ejemplos de desarrollo.
4. Medir tiempos de consulta y caché sobre los dispositivos y carga acordados; optimizar según resultados.
5. Asociar EAS, configurar identificadores y entornos y generar builds de validación.
6. Aprobar una release, registrar cambios y etiquetar la versión correspondiente.
