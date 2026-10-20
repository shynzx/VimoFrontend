# Recorridos de usuario de VIMO

## Inicio — ilustraciones 1 y 2

La pantalla de inicio presenta dos accesos: **Base de datos de cartas** y **Archivos lore**. El usuario puede consultar información durante una partida de PC o explorar el mundo del juego fuera del combate.

Las ilustraciones no fueron adjuntadas. La implementación sigue su descripción funcional; queda pendiente comparar el aspecto visual cuando se proporcionen las imágenes.

## Consulta rápida — ilustraciones 3 y 4

1. El jugador identifica en PC el ID visible de cuatro dígitos de la carta.
2. En el celular abre **Base de datos de cartas**.
3. Introduce el código completo, incluidos los ceros iniciales, y pulsa **Buscar**.
4. Si existe una coincidencia exacta, se abre su detalle con ID, nombre, costo, rareza, efecto y descripción.
5. El jugador decide si el potenciador encaja con su estrategia y cierra la consulta.

La consulta se valida antes de iniciarse. Los códigos incompletos no se interpretan como coincidencias parciales. La búsqueda por texto sigue disponible como opción adicional.

`gameId` almacena el código visible como texto de cuatro dígitos; `id` conserva el identificador interno y las relaciones. Si el catálogo usa directamente un `id` de cuatro dígitos, el modelo móvil también lo reconoce como código visible. La caché preserva ambos valores. PostgreSQL exige que los códigos visibles registrados sean únicos y tengan cuatro dígitos.

Los códigos `0001` a `0006` de los ejemplos sirven para probar el recorrido; no representan códigos oficiales. Los registros antiguos sin código deben recibir el código real al incorporar el catálogo. No se generan códigos públicos automáticamente para datos existentes.

## Exploración de historia — ilustración 5

1. Fuera del combate, el usuario abre **Archivos lore**.
2. Selecciona personajes, enemigos o instalaciones.
3. Abre una ficha para consultar descripción, historia y los campos disponibles, como dificultad o ubicación.
4. Cuando existen cartas relacionadas, puede abrir su detalle.

## Aceptación pendiente

- Contrastar el diseño con las ilustraciones originales.
- Probar teclado numérico, búsqueda, presentación de resultados y regreso en Android e iOS.
- Validar códigos y estadísticas contra el catálogo oficial cuando se entregue.
