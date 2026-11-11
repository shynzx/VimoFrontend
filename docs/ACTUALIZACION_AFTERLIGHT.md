# Guía móvil de AfterLight · 11 de noviembre de 2026

Referencia: [AFTER LIGHT en Figma](https://www.figma.com/design/CsKcKS3qtpDfb43BoK5x95/AFTER-LIGHT), página `0:1`, y copia local del GDD. El alcance acordado es una **guía móvil**. HUD, pausa, opciones y finales se explican como contenido de consulta; la app no controla una partida ni simula estadísticas del jugador.

## Contenido y navegación

| Sección | Ruta | Contenido |
| --- | --- | --- |
| Centro táctico | `/inicio` | Accesos a las cuatro áreas de consulta |
| Cartas | `/cartas` | 21 cartas, seis categorías, búsqueda por nombre/efecto/código y 21 SVG originales |
| Código | `/cartas/codigo` | Teclado numérico de cuatro dígitos, conserva ceros iniciales |
| Detalle de carta | `/cartas/CAR-017` | Efecto, nivel máximo, disponibilidad e icono específico |
| Lore | `/guia` | Personajes, enemigos y lugares; perfiles y cartas relacionadas |
| Archivo | `/archivo` | 28 registros con autor, cargo, sector, resumen y texto completo |
| Registro | `/archivo/lucia-ferran` | Transcripción y vínculo a las peticiones de Issac |
| Manual | `/manual` | 20 capítulos, 25 referencias de pantallas/estados y créditos |
| Capítulo | `/manual/controles` | Texto completo, títulos, listas, citas y tablas desplazables |
| Pantalla | `/manual/vista/hud` | Explicación del estado y enlaces a los capítulos correspondientes |

Las búsquedas ignoran mayúsculas y acentos. El Archivo permite filtrar los cuatro registros vinculados a Issac. Los desenlaces y las peticiones contienen revelaciones de la historia y se presentan con ese aviso. No se inventa progreso: todos los testimonios están disponibles como referencia.

## Datos actualizados

- Eco-10 y Hades sustituyen los nombres anteriores. Los IDs `eco-7` y `terra` permanecen estables para conservar enlaces y relaciones de clientes anteriores.
- CAR-008 y CAR-016: +2.4 m; CAR-017: +0.72 m/s; CAR-018: +0.6 m/s; CAR-020: +1.2 m, según el catálogo del Figma.
- Las transcripciones de los 28 registros proceden de «Diálogos y Narrativa»; autor, cargo y contexto proceden de «Personajes». Se conservan los estados propuestos y pendientes que el GDD declara, sin presentarlos como funciones terminadas.
- El manual incorpora los capítulos de Diseño, Historia y Mundo, Contenido y Experiencia. Excluye las plantillas vacías, imágenes de referencia de Obsidian, navegación del editor y las identidades marcadas como internas. La información jugable y narrativa se conserva, con formato nativo y tablas horizontales.

## Diseño

Fondo `#000000`, superficies `#0B0B0B` y `#1A1A1A`, texto `#ECEAE4`, secundario `#C9C9C9`, acento `#FF5964`, selección `#FFD9DC` y bordes discretos. **Kelly Slab** para títulos y nombres; **Inter** para cuerpo, etiquetas y acciones. Radios de 3 unidades. Todos los iconos de cartas se descargan al repositorio y conservan su raíz SVG de 96 × 96; no hay URLs temporales de Figma en tiempo de ejecución. Las marcas y partículas de créditos también son originales.

## API y mantenimiento

Nuevas lecturas: `/api/v1/manual`, `/registros`, `/vistas` y `/creditos`. Manual, registros y vistas admiten detalle `/{id}`. Mantienen el contrato `{ exito, datos, meta }` y los errores JSON existentes.

El contenido editorial se empaqueta en la API como recursos JSON. No requiere la carpeta del GDD en el servidor ni modifica las operaciones administrativas existentes. Para regenerar manual y registros, ejecutar en el backend:

```powershell
node tools/exportar-gdd.mjs "ruta/al/gdd-videojuegos"
dotnet build
```

Las cartas y el lore se actualizan mediante `GuiaAfterLightActualizada`, una migración de datos que conserva claves, tablas y fechas de creación. Aplicar con `dotnet ef database update`.

La caché del cliente cubre los ocho catálogos con el mismo TTL de cinco minutos, deduplicación, validación y respaldo persistente. Los nuevos capítulos y registros quedan disponibles sin conexión después de su primera carga. Los SVG y la fuente se incluyen en el paquete.

## Verificación y límites

- Exportación web de producción, `npm run typecheck`, `npm run lint` y 14 pruebas del cliente, incluyendo persistencia de los nuevos catálogos y rechazo de registros corruptos.
- Backend compilado, migración aplicada contra LocalDB y `dotnet ef migrations has-pending-model-changes` sin diferencias.
- `node tools/verificar-api.mjs URL_BASE`: verifica catálogos, todos sus detalles, referencias entre vistas y capítulos, errores 404, datos de cartas y cambios de Eco-10/Hades.
- Revisión web a 390 × 844: catálogo, geometría de los 21 iconos, búsquedas, Archivo, filtro de Issac y navegación al manual.
- Figma limitó las consultas del plan Starter durante la revisión. Se obtuvo contexto de alta fidelidad de cartas, Archivo, opciones, créditos, HUD, contacto con Issac y las dos victorias. Las demás referencias usan el inventario de nodos y el GDD; queda pendiente su comparación visual directa. Las pantallas PC se adaptan como guía, no como réplicas de 1920 × 1080.
- Pendiente: aceptación en Android/iOS físicos, builds EAS y publicación. La portada y algunos perfiles conservan recursos anteriores porque el nuevo archivo no define su equivalente móvil.
