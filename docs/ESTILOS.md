# Estilos compartidos de VIMO

## Estructura

- `src/theme/tokens.ts`: única definición de colores semánticos, espaciado, radios, tamaños y tipografía.
- `src/theme/styles.ts`: estilos reutilizables creados una vez con `StyleSheet.create` para pantallas, tarjetas, formularios, pestañas, mensajes y modales.
- `src/components/AppButton.tsx`: acción común con variantes `primary`, `secondary` y `danger`, estado deshabilitado y etiquetas de accesibilidad.

Inicio, cartas, archivos lore, detalle de carta, avisos y navegación consumen estas definiciones. Los alias locales de las pantallas referencian los mismos estilos compartidos.

## Reglas para ampliar la interfaz

1. Utilizar nombres semánticos como `colors.primary`, `colors.textSecondary` o `colors.danger`; mantener los colores literales dentro de `tokens.ts`.
2. Reutilizar `ui.body`, `ui.caption`, `ui.heading` y `ui.title` para mantener jerarquías, tamaño y altura de línea consistentes.
3. Usar `AppButton` para acciones estándar. Reservar `TouchableOpacity` para tarjetas enlazadas, pestañas y controles específicos, aplicando los estilos compartidos.
4. Los controles interactivos tienen un tamaño mínimo de 48 unidades. Usar altura mínima, evitando alturas fijas que recorten texto ampliado.
5. Las filas y las pestañas permiten ajuste de línea. Las pantallas comparten ancho máximo de 720 unidades y los modales de 560.
6. Utilizar la escala de espaciado y los radios comunes. Para un componente específico, crear estilos fuera del render mediante `StyleSheet.create` y componerlos con los estilos existentes.
7. Componer estados mediante arreglos de estilos, por ejemplo `[ui.tab, selected && ui.activeTab]`; evitar objetos de estilo dentro del JSX.
8. Mantener el escalado de texto del sistema y las etiquetas de accesibilidad. Los avisos no dependen únicamente del color para comunicar su significado.

La paleta es clara, coherente con la configuración actual de Expo. Esta normalización no introduce nuevas dependencias ni modifica el contrato de datos.
