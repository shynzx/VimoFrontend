# Recorridos de usuario de VIMO

Los recorridos siguen el Figma "Wireframes - After Light" ([estilos](ESTILOS.md)).

## Portada y Centro táctico

1. La app abre en la portada de AfterLight. **Get started** lleva al **Centro táctico**.
2. El Centro táctico presenta dos accesos: **Base de datos de cartas** (efectos, estadísticas y mejoras de combate) y **Archivo de lore** (personajes, enemigos y lugares de Terra).
3. La barra inferior permite volver en cualquier momento a Inicio, Cartas o Lore.

VIMO solo consulta información: no modifica la partida.

## Consulta rápida de cartas

1. Durante una partida de PC, el jugador identifica la carta que quiere consultar.
2. En el celular abre **Base de datos de cartas**.
3. Escribe el código de cuatro dígitos con el teclado numérico de la pantalla y pulsa **Consultar carta**.
4. Si el código existe, se abre el detalle de la carta con su categoría, el efecto por nivel, el nivel máximo y la disponibilidad.
5. El jugador decide si la mejora encaja con su estrategia y vuelve a la consulta.

El código se deriva del ID de diseño de la carta: `CAR-013` corresponde a `0013`. La búsqueda del cliente y de la API también acepta el ID completo (`CAR-013`, sin distinguir mayúsculas). Los códigos incompletos no se interpretan como coincidencias parciales: `013` no encuentra `0013`. Si el código no existe, la pantalla indica que no hay ninguna carta con ese código y permanece en la consulta.

`id` conserva el ID de diseño, que usan los detalles y las relaciones; `gameId` guarda el código de cuatro dígitos como texto para preservar los ceros iniciales. La caché preserva ambos valores.

Los códigos válidos son `0001` a `0021`, uno por cada carta del catálogo del GDD.

## Archivo de lore

1. Fuera del combate, el usuario abre **Archivo de lore**.
2. Elige la pestaña **Personajes**, **Enemigos** o **Lugares**.
3. Abre una ficha para ver el perfil, organizado por secciones:
   - Personajes: descripción, habilidades, debilidades e historia.
   - Enemigos: rol de combate, comportamiento, debilidades y aspecto.
   - Lugares: descripción, papel en la partida e importancia.
4. Cuando el personaje o enemigo tiene cartas relacionadas, puede abrir su detalle desde el perfil.

Las secciones sin información en el catálogo no se muestran.

## Aceptación pendiente

- Probar teclado numérico, consulta, presentación del detalle y regreso en Android e iOS.
- Añadir el escaneo del código con la cámara.
- Incorporar las ilustraciones de las cartas y los retratos del Archivo de lore.
