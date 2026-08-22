# Licencias de las fuentes

Este directorio **redistribuye** archivos `.woff2` de fuentes de terceros. Todas
son libres, pero libre no quiere decir sin condiciones: las licencias bajo las
que están exigen que **el texto de la licencia y el aviso de copyright viajen
con los archivos**.

⚠️ Mientras el repositorio fue privado esto no aplicaba —no había
redistribución—. Desde que es público, sí.

## Qué hay acá

| Archivos | Fuente | Licencia | Origen |
|---|---|---|---|
| `EBGaramond-{Regular,Italic,SemiBold}.woff2` | EB Garamond | SIL Open Font License 1.1 | <https://fonts.google.com/specimen/EB+Garamond> |
| `Inter-{Regular,Medium}.woff2` | Inter | SIL Open Font License 1.1 | <https://fonts.google.com/specimen/Inter> |
| `JetBrainsMono-{Regular,Medium}.woff2` | JetBrains Mono | SIL Open Font License 1.1 | <https://fonts.google.com/specimen/JetBrains+Mono> |
| `PirataOne-Regular.woff2` | Pirata One | SIL Open Font License 1.1 | <https://fonts.google.com/specimen/Pirata+One> |
| `Ubuntu-{Regular,Italic,Medium}.woff2` | Ubuntu | Ubuntu Font Licence 1.0 | <https://fonts.google.com/specimen/Ubuntu> |
| `UbuntuMono-Regular.woff2` | Ubuntu Mono | Ubuntu Font Licence 1.0 | <https://fonts.google.com/specimen/Ubuntu+Mono> |

## Lo que falta y por qué no lo escribí de memoria

**Falta el texto íntegro de cada licencia**, y tiene que estar: la OFL lo pide
explícitamente para cualquier redistribución.

No lo transcribí porque un texto legal reproducido de memoria puede salir
alterado, y una licencia con una palabra cambiada es peor que ninguna. Se
obtiene del propio origen: cada descarga de Google Fonts trae su `OFL.txt`, y
Ubuntu trae su `LICENCE.txt`.

**Cómo completarlo**, una sola vez:

1. Bajar cada familia desde el enlace de la tabla.
2. Copiar el `OFL.txt` de cada una acá como `OFL-<Fuente>.txt` (o uno solo si el
   texto es idéntico, indicando en esta tabla a qué familias cubre).
3. Copiar el `LICENCE.txt` de Ubuntu como `UFL-Ubuntu.txt`.

⚠️ **Al agregar una fuente nueva, se agrega su licencia en el mismo commit.** Es
la única forma de que esto no vuelva a quedar atrás — nadie audita un directorio
de binarios dos años después.

## Nota sobre el alcance

La OFL permite empaquetar las fuentes dentro de software mayor —que es
exactamente este caso, un sistema de diseño que las sirve— pero **prohíbe
venderlas por separado** y exige conservar los avisos. Ninguna de las dos cosas
choca con cómo se usan acá.
