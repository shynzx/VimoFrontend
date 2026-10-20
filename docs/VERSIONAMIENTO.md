# Git Flow y SemVer

## Ramas e integración

| Rama | Origen | Destino por pull request |
| --- | --- | --- |
| `main` | Rama permanente | Código estable aprobado para producción. |
| `develop` | `main` | Integración de la próxima versión. |
| `feature/nombre-funcionalidad` | `develop` | `develop` |
| `bugfix/nombre-correccion` | `develop` | `develop` |
| `release/MAJOR.MINOR.PATCH` | `develop` | `main`; después reintegrar sus cambios a `develop`. |
| `hotfixes/nombre-correccion` | `main` | `main`; después reintegrar sus cambios a `develop` y a una release activa, si existe. |

Se usa `main` como nombre de la rama estable y `hotfixes/` como prefijo de correcciones urgentes, de acuerdo con la estrategia del proyecto. Los nombres se escriben en minúsculas y sin espacios. No se crean ramas vacías por categoría.

Las correcciones de una versión candidata se realizan en su rama `release`. Una vez creada, esa rama no recibe nuevas funcionalidades. Una corrección de producción no debe incorporar funcionalidades pendientes de `develop`.

## Trabajo diario

Desde un árbol de trabajo limpio y con `develop` actualizado:

```powershell
git switch develop
git switch -c feature/nombre-funcionalidad
# Implementar, verificar y confirmar los cambios.
# Abrir un pull request hacia develop.
```

Para errores de desarrollo, usar `bugfix/nombre-correccion` con el mismo origen y destino. Mantener cada cambio en su rama hasta su revisión. Al publicar una rama, usar `git push -u origin <nombre-rama>` para que siga su propia rama remota.

No configurar una rama `feature/*` para seguir `origin/develop`: podría enviar cambios al destino equivocado al ejecutar un push sin argumentos. No integrar ni etiquetar cambios sin confirmar o sin validar.

## Versionado semántico

Formato: `MAJOR.MINOR.PATCH`, con etiquetas `vMAJOR.MINOR.PATCH`.

- `MAJOR`: cambios incompatibles en la API pública estable o los contratos de compatibilidad del producto. Restablece MINOR y PATCH a cero.
- `MINOR`: funcionalidades compatibles. Restablece PATCH a cero.
- `PATCH`: correcciones compatibles.
- `0.y.z`: desarrollo inicial; documentar expresamente los cambios incompatibles. No usar los componentes como números de fase.
- Prerrelease: `0.2.0-alpha.1`, `0.2.0-beta.1` o `0.2.0-rc.1`, con etiquetas como `v0.2.0-rc.1`.

Cada repositorio lleva su propio historial de versiones. Un cambio coordinado debe indicar las versiones compatibles del cliente y de la API. Las versiones del protocolo HTTP y los números de compilación nativos son independientes de la versión del producto.

## Preparar una liberación

1. Desde `develop` actualizado y limpio, crear `release/<version>` para el alcance aprobado.
2. Actualizar los archivos de versión del repositorio y `CHANGELOG.md`. Sacar los cambios de «Sin publicar» a la versión candidata y documentar compatibilidad y migraciones.
3. Ejecutar las verificaciones del repositorio y las pruebas de aceptación. Registrar el resultado en el pull request.
4. Aprobar e integrar la release a `main`. Crear la etiqueta `v<version>` sobre el commit exacto aprobado en `main`, nunca sobre el HEAD de una feature. No mover ni reutilizar etiquetas publicadas.
5. Reintegrar los cambios de preparación a `develop`. Mantener la rama release hasta completar ambas integraciones.
6. Publicar únicamente la versión aprobada y su etiqueta. Las candidatas llevan sufijo de prerrelease.

Para un hotfix, partir de `main`, incrementar PATCH cuando la corrección sea compatible, validar y seguir las integraciones indicadas en la tabla. Si hay una release activa, incorporar también la corrección sin reemplazar su versión candidata.

## Revisión y protección

Cada pull request debe indicar su rama de origen y destino, comportamiento resultante, pruebas, compatibilidad y limitaciones. Configurar en GitHub protección para `main` y `develop`, revisión aprobada, comprobaciones obligatorias y prohibición de pushes forzados y eliminación. La documentación y los workflows no activan estas protecciones por sí solos.

## Aplicación al frontend

- Rama de trabajo actual: `feature/vimo-scaffold`; destino: `develop`.
- Ramas permanentes locales: `main` (antes `master`) y `develop`.
- Remoto `origin`: `https://github.com/shynzx/VimoFrontend.git` (repositorio privado). La protección de ramas se configura por separado en GitHub.
- Versión base de desarrollo: `0.1.0`, todavía sin etiqueta de publicación local.
- Sincronizar `package.json`, `package-lock.json` (raíz y `packages[""]`) y `app.json` (`expo.version`) al preparar una versión.
- Validaciones: `npm run lint`, `npm run typecheck` y `npm test`. Validar Android/iOS para cambios móviles antes de una liberación.
- La API es el repositorio ASP.NET (VimoBackend), con su propio ciclo de versión; un cambio de contrato requiere actualizar `docs/API_CONTRACT.md` en ambos lados.
