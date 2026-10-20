# Estilos compartidos de VIMO

El diseño sigue el Figma **"Wireframes - After Light"** (`https://www.figma.com/design/LEJTFgm8nlpR3O3u5nrZeO`), con cinco pantallas: portada, panel principal, búsqueda de cartas, detalle de carta y perfil del archivo de lore.

## Estructura

- `src/theme/tokens.ts`: única definición de colores, familias tipográficas, espaciado, radios, tamaños y escala de texto.
- `src/theme/styles.ts`: estilos reutilizables creados una vez con `StyleSheet.create` (cabecera, paneles, etiquetas, secciones, acciones, pestañas y estados).
- `src/components/BotonApp.tsx`: acción del Figma ("Action", 56 de alto) con flecha hacia adelante o de regreso, variantes `primary` y `secondary`, estados deshabilitado y de carga.
- `src/components/EncabezadoPantalla.tsx`: botón de volver y título de la pantalla.
- `src/components/Icono.tsx`: iconos de Lucide (`lucide-react-native`), los mismos del Figma, con trazo de 1 px.
- `assets/images/`: imágenes descargadas del Figma (portada y holograma del panel).

## Sistema visual

| Token | Valor | Uso |
| --- | --- | --- |
| `colors.background` | `#070F1D` | Fondo de las pantallas |
| `colors.surface` / `surfaceRaised` | `#0E1C2E` / `#14263B` | Paneles, barra de pestañas, teclas |
| `colors.primary` | `#FF4659` | Acento, acciones, etiquetas y bordes destacados |
| `colors.primarySoft` | `#351B2A` | Fondos destacados (estadísticas, cartas) |
| `colors.text` / `textSecondary` | `#F1F6FC` / `#9AACBF` | Texto principal y secundario |
| `colors.border` | `#263D54` | Separadores y bordes neutros |

Tipografías (cargadas con `@expo-google-fonts` en `src/app/_layout.tsx`): **Rajdhani** para títulos y botones en mayúsculas, **IBM Plex Mono** para etiquetas y códigos, **Inter** para el texto.

## Reglas para ampliar la interfaz

1. Utilizar nombres semánticos (`colors.primary`, `colors.textSecondary`); mantener los colores literales dentro de `tokens.ts`.
2. Reutilizar `ui.title`, `ui.display`, `ui.heading`, `ui.label`, `ui.body`, `ui.copy` y `ui.caption` para mantener la jerarquía del Figma.
3. Usar `BotonApp` para acciones y `EncabezadoPantalla` para la cabecera. Reservar `TouchableOpacity` para tarjetas enlazadas, pestañas y teclas.
4. Los controles interactivos tienen un área táctil mínima de 48 unidades (el botón de volver de 36 usa `hitSlop`). Usar altura mínima en lugar de alturas fijas en contenedores con texto.
5. Las pantallas comparten un ancho máximo de 720 unidades.
6. Crear los estilos específicos fuera del render con `StyleSheet.create` y componerlos con los compartidos. Con `Link asChild`, pasar un estilo plano: Expo Router no acepta arreglos.
7. Componer estados mediante arreglos, por ejemplo `[ui.tab, selected && ui.activeTab]`.
8. Mantener el escalado de texto del sistema y las etiquetas de accesibilidad. Los avisos no dependen únicamente del color.

## Diferencias con el Figma

Los textos del Figma (General Reed, "Mejora de disparo rápido", "Poder táctico 85/100") son de ejemplo. La app muestra el catálogo real del GDD, que no incluye ilustraciones de cartas, retratos, duración ni poder táctico. Por eso:

- El recuadro de ilustración de la carta muestra el emblema de su categoría, y las estadísticas, el efecto por nivel y el nivel máximo.
- El retrato del perfil muestra un icono del tipo de registro y se omite el medidor de poder.
- El panel principal omite el nombre del jugador y el estado de partida, porque la app no está conectada a la partida.
- La búsqueda omite el botón de cámara hasta que se implemente el escaneo.
- La lista del Archivo de lore, sin pantalla en el Figma, usa el mismo sistema visual.
