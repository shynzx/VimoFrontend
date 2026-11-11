# Estilos compartidos de VIMO

Referencia vigente: [AFTER LIGHT](https://www.figma.com/design/CsKcKS3qtpDfb43BoK5x95/AFTER-LIGHT). Las pantallas PC se adaptan como guía móvil; ver [cobertura y límites](ACTUALIZACION_AFTERLIGHT.md).

## Sistema visual

| Token | Valor | Uso |
| --- | --- | --- |
| background | #000000 | Fondo |
| surface / surfaceRaised | #0B0B0B / #1A1A1A | Paneles y controles |
| primary | #FF5964 | Acentos y avisos |
| selected / institutional | #FFD9DC / #B52D3A | Selección e identidad |
| text / textSecondary | #ECEAE4 / #C9C9C9 | Texto |
| muted / border | #8A8A8A / #343331 | Metadatos y separadores |

Kelly Slab para títulos, nombres y códigos; Inter para cuerpo, etiquetas y acciones. Radios de 3 unidades. Los identificadores de fuente `mono` y `monoRegular` se conservan por compatibilidad interna y ahora resuelven a Inter.

## Archivos y componentes

- `src/theme/tokens.ts`: única definición de colores, tipografía, espaciado, radios y tamaños.
- `src/theme/styles.ts`: superficies, textos, botones, pestañas y estados compartidos.
- `BotonApp`, `EncabezadoPantalla`, `EstadoConsulta` y `AvisoCatalogo`: acciones, navegación y estados de carga/error/caché.
- `IconoCarta`: 21 SVG originales de Figma en `assets/figma/cartas`, identificados por CAR-001 a CAR-021. Mantener las dimensiones de raíz de 96 × 96.
- `DecoracionCreditos`: partículas de 3 × 3 y marcas de 90 × 8 descargadas de Figma.
- `TextoManual`: títulos, párrafos, listas, citas y tablas nativas con desplazamiento horizontal.

## Reglas de implementación

1. Usar tokens semánticos y componer los estilos compartidos.
2. Usar `StyleSheet.create` fuera del render para los estilos de cada pantalla.
3. Mantener áreas táctiles de al menos 48 unidades; usar `hitSlop` para controles visualmente más pequeños.
4. Permitir el escalado del texto; evitar alturas fijas donde el contenido puede crecer.
5. Respetar el ancho máximo compartido de 720 unidades y probar a 390 × 844.
6. Con `Link asChild`, utilizar un estilo plano.
7. No sustituir los iconos de cartas por iconos de categoría ni alterar los SVG descargados.
8. No usar URLs temporales de Figma en tiempo de ejecución.
9. Distinguir las cifras ilustrativas del diseño de los datos reales de la API; VIMO no tiene conexión con la partida.

La portada y algunos perfiles conservan recursos del diseño anterior. No existe un equivalente móvil definido para ellos en el nuevo archivo. Las pantallas del juego se consultan como documentación; no se incorporan botones de pausa, volumen o reinicio que aparenten controlar una partida.