# Licencias de las fuentes

Este directorio **redistribuye** archivos `.woff2` de fuentes de terceros. Todas
son libres, pero libre no quiere decir sin condiciones: las licencias bajo las
que están exigen que **el texto de la licencia y el aviso de copyright viajen
con los archivos**. Por eso cada familia tiene su licencia acá al lado, tomada
de su origen y sin transcribir.

## Qué hay acá

| Archivos | Fuente y versión | Licencia | Origen |
|---|---|---|---|
| `Inter-{Regular,Medium,SemiBold}.woff2` | Inter 4.1 | [`OFL-Inter.txt`](OFL-Inter.txt) | <https://github.com/rsms/inter/releases> |
| `JetBrainsMono-{Regular,Medium}.woff2` | JetBrains Mono NL 2.304 | [`OFL-JetBrainsMono.txt`](OFL-JetBrainsMono.txt) | <https://github.com/JetBrains/JetBrainsMono/releases> |
| `EBGaramond-{Regular,Italic,SemiBold}.woff2` | EB Garamond | [`OFL-EBGaramond.txt`](OFL-EBGaramond.txt) | <https://fonts.google.com/specimen/EB+Garamond> |
| `PirataOne-Regular.woff2` | Pirata One | [`OFL-PirataOne.txt`](OFL-PirataOne.txt) | <https://fonts.google.com/specimen/Pirata+One> |
| `Ubuntu-{Regular,Italic,Medium}.woff2` · `UbuntuMono-Regular.woff2` | Ubuntu · Ubuntu Mono | [`UFL-Ubuntu.txt`](UFL-Ubuntu.txt) | <https://fonts.google.com/specimen/Ubuntu> |

Las cuatro `OFL-*` son la SIL Open Font License 1.1; lo que cambia de una a
otra es el aviso de copyright, y por eso no se unifican. `UFL-Ubuntu.txt` es la
Ubuntu Font Licence 1.0 y cubre las dos familias: el texto es el mismo.

## Inter y JetBrains Mono se generan acá

No son los archivos de Google Fonts. Su subset «latin» no trae el signo del
guaraní (`₲`, U+20B2) ni las letras con tilde del idioma guaraní (ẽ ĩ ũ ỹ), y
un producto que muestra precios en Paraguay dibujaba ese signo con la fuente
que tuviera cada máquina.

Se arman desde las descargas oficiales con `scripts/subset-fonts.py`, que dice
exactamente qué caracteres y qué features entran. El resultado es
determinista: correrlo de nuevo sobre las mismas versiones da los mismos bytes.

| | Trae | No trae |
|---|---|---|
| **Inter** | Latín con acentos y ñ, guaraní, `₲` `€`, flechas `← ↑ → ↓`, `≈` `−` `✓`, cifras tabulares (`tnum`) | Variantes de estilo (`ss01`…, `cv01`…): no se usan y pesan |
| **JetBrains Mono** | Lo mismo, salvo lo de la columna de al lado | **`₲`: la fuente no lo tiene**, en ninguna versión. **Ligaduras**: es la variante NL, a propósito — en un código, `->` son dos caracteres |

Quien muestre importes con `₲` en monoespaciada tiene que poner en su
`--ix-font-mono` una segunda familia que sí lo traiga —Inter—, o el signo cae
en la fuente del sistema.

Las demás familias siguen siendo las de Google Fonts, sin modificar.

⚠️ **Pirata One declara nombre reservado.** La OFL prohíbe redistribuir una
versión modificada con ese nombre, y recortarla es modificarla: ese archivo se
sirve tal cual sale de su origen y **no pasa por el script**.

## Al agregar una fuente

**Su licencia entra en el mismo commit**, como archivo propio y tomada del
origen, nunca escrita de memoria: un texto legal con una palabra cambiada es
peor que ninguno. Es la única forma de que esto no quede atrás — nadie audita
un directorio de binarios dos años después.

## Nota sobre el alcance

La OFL permite empaquetar las fuentes dentro de software mayor —que es
exactamente este caso, un sistema de diseño que las sirve— pero **prohíbe
venderlas por separado** y exige conservar los avisos. Ninguna de las dos cosas
choca con cómo se usan acá.
