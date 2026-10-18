# inox-ui — Contexto para Claude Code

## Qué es Inox UI

Design system de Lantano. Dos capas completamente independientes:

1. **CSS/SCSS universal** (`style/`) — funciona con cualquier framework o HTML puro. Sin dependencias JS.
2. **Componentes Svelte 5** (`src/lib/`) — consumidos por los productos de Lantano. Requieren Svelte 5.

**La fuente canónica es este repo Git** (`github.com/ruizmarselo94-wq/inox-ui`). No existe un paquete npm publicado aún — los consumidores lo agregan como dependencia Git fijada a un commit (ej. `git+ssh://git@github.com/ruizmarselo94-wq/inox-ui.git#<sha>`), no por path ni copia local. Un cambio entra a `main` como dice «Cómo entra un cambio», abajo; cada consumidor decide cuándo mover su referencia.

**Versión: `0.1.0`, y ahí se queda.** No hay paquete publicado en ningún
registro y cada consumidor fija Inox UI **por commit SHA**, así que el número no
resuelve nada. Numerar releases que nunca se publicaron creaba un ciclo
imaginario: se llegó a tener tres números distintos a la vez (`package.json`
0.1.17, `CHANGELOG.md` 0.1.5, este archivo 0.1.2). **No bumpear la versión.**
Lo que entra va a `[Unreleased]` del CHANGELOG. El primer número real se asigna
el día que se publique en un registro.

## Cómo entra un cambio

**`main` es lo publicado.** Inox UI no se despliega, así que no tiene
`production` ni stages: cualquier commit de `main` puede quedar fijado por un
consumidor en cualquier momento, y uno de ellos corre en producción. Tener una
sola rama endurece las reglas, no las afloja:

1. **Nunca directo a `main`.** Rama de tarea `<tipo>/<descripción>` —el tipo
   del commit, la descripción en inglés—, pull request y CI en verde. La
   aprobación del mantenedor va en la puerta solo si en el repo escribe
   código más de una persona: mientras sea uno, el agente mergea en verde y
   avisa (vault: `convenciones-git`, «La puerta a `main`»). Se mergea **en
   local** con `git merge --ff-only`: conserva el SHA que se probó y la firma.
2. **Antes de entrar, se prueba en cada consumidor.** El que pidió el cambio,
   en su propio PR con el pin apuntando a la rama. El que está en producción,
   compilado en una copia aparte —sin tocar su repo—: svelte-check y el SCSS
   de su `main.scss`, primero con su pin actual y después con el nuevo,
   comparando el CSS que recibiría.
3. **La historia de `main` no se reescribe nunca.** Un pin es un SHA; si
   desaparece, la instalación del consumidor deja de resolver. Nada de
   `--force`, `rebase` ni `reset` sobre `main`.
4. **Un consumidor fija solo SHAs que están en `main`.** El de una rama vale
   mientras dura su PR; si la rama se rebasea, el SHA cambia y el pin queda
   colgado.
5. **Lo incompatible lleva `!`** en el commit y una entrada en «Al mover el
   pin» del CHANGELOG: qué tiene que hacer el consumidor y qué pasa si no lo
   hace.
6. **Siempre todo arriba.** Ningún trabajo queda solo en el disco: cada commit
   verificado se sube, y una sesión termina con el árbol limpio y `main` igual
   a `origin/main`.

El porqué de cada regla está en el vault de Lantano, `convenciones-git`,
«Una librería: Inox UI».

## Prefijos

- Clases CSS: `ix-*` — ejemplo: `ix-btn`, `ix-page__header`, `ix-grid-stats`
- Tokens CSS: `--ix-*` — ejemplo: `--ix-sp-4`, `--ix-color-primary`, `--ix-r-md`
- Inox UI **no define colores**. Los tokens `--ix-color-*` son variables vacías. Cada producto consumidor los llena en su propio archivo de tema.

## Componentes disponibles (18)

**Primitivos** (`src/lib/components/primitives/`):
- `IxAvatar` — avatar con foto + fallback a inicial, props: `name`, `src?`, `size?` (`sm | md | lg`), `alt?`. Muestra la foto si carga; cae a la inicial sobre gradiente de marca si no hay `src` o la imagen falla (`onerror`)
- `IxBtn` — botón con variants: `primary | outline | secondary | ghost | danger`, sizes: `sm | md | lg`
- `IxBtnIcon` — botón de solo ícono, props: `title` (a11y), `danger`, `disabled`
- `IxBadge` — etiqueta de estado, variants: `ok | warn | err | info | neutral`
- `IxCard` — contenedor con superficie elevada
- `IxIcon` — ícono SVG inline del catálogo Lucide, prop: `name`, `size`, `ariaHidden`
- `IxSpinner` — indicador de carga animado, props: `size` (px), `label` (aria)

**Formularios** (`src/lib/components/forms/`):
- `IxInput` — campo de texto, props: `label`, `type`, `placeholder`, `error`, `disabled`, `required`
- `IxSelect` — selector nativo estilizado
- `IxToggle` — interruptor booleano
- `IxToggleRow` — fila con label + descripción + toggle

**Layout** (`src/lib/components/layout/`):
- `IxShell` — contenedor raíz de la app (sidebar + topbar + contenido)
- `IxSidebar` — navegación lateral con collapse y drawer mobile
- `IxTopbar` — barra superior con hamburguesa mobile y menú de usuario

**Datos** (`src/lib/components/data/`):
- `IxBarChart` — gráfico de barras CSS, props: `bars: {label, value}[]`, `height?`, `formatValue?`, `emptyText?`
- `IxDataTable` — tabla tipada con columnas configurables, genérico `<T>`
- `IxStatCard` — tarjeta de métrica con label, valor, unidad y acento cromático

**Feedback**:
- `IxToast` — notificación flotante individual
- `IxToastProvider` — contenedor de toasts, debe wrappear la app raíz

## Composables (contexto Svelte)

- `provideShell(opts)` / `useShell()` — estado del shell (tema, colapsado, drawer mobile)
- `provideToast()` / `useToast()` — cola de toasts

## Clases CSS principales

```
Layout estructural:
  ix-shell, ix-main-container, ix-page-slot
  ix-sidebar, ix-sidebar--collapsed, ix-sidebar--mobile-open
  ix-topbar
  ix-page, ix-page__header, ix-page__title, ix-page__sub, ix-page__actions

Grids:
  ix-grid-stats          auto-fill stat cards (min 200px)
  ix-grid-2              2fr / 1fr contenido + lateral
  ix-cols + ix-cols-1/2/3/4/auto    columnas explícitas
  ix-form-grid + ix-form-grid--2/3  formularios en columnas
  ix-toolbar, ix-toolbar--between, ix-toolbar--end

Estados:
  ix-state               contenedor centrado
  ix-state--error        variante roja
  ix-state__icon, ix-state__title, ix-state__text

Componentes CSS:
  ix-btn, ix-btn--primary/outline/secondary/ghost/danger
  ix-btn--sm/lg, ix-btn--full
  ix-btn-icon, ix-btn-icon--danger
  ix-badge, ix-badge--ok/warn/err/info/neutral
  ix-card
  ix-input, ix-select, ix-field, ix-label
  ix-toggle, ix-toggle-row
  ix-table, ix-table-wrap
  ix-stat-card
  ix-modal, ix-modal__header, ix-modal__body, ix-modal__footer
  ix-modal--sm/lg/xl
  ix-toast
  ix-avatar, ix-avatar--sm/md/lg, ix-avatar__img
  ix-spinner
  ix-skeleton, ix-skeleton--text/circle/rect
```

## Tokens estructurales (`style/tokens.scss`)

```
Espaciado:  --ix-sp-1/2/3/4/5/6/8/10/12  (4px → 48px)  ← cuánto
Ritmo:      --ix-gap-inline/item/block/section/zone            ← cuándo
Radio:      --ix-r-xs/sm/md/lg/xl/full
Fuentes:    --ix-font-ui, --ix-font-brand, --ix-font-mono
            (opcionales, con respaldo en mono: --ix-font-input, --ix-font-chrome)
Tamaños:    --ix-font-size-xs/sm/md/lg/xl/2xl/3xl/4xl
Sombras:    --ix-shadow-sm/md/lg
Z-index:    --ix-z-base/raised/overlay/modal/toast/topbar
Transición: --ix-t-fast/normal/slow, --ix-ease
⚠️ **Las fuentes son opt-in, pero `--ix-font-mono` NO es opcional si usás formularios.**
`_forms.scss` aplica `var(--ix-font-input, var(--ix-font-mono))` a `.ix-input`,
`.ix-select` y `.ix-textarea` — o sea que, **salvo que el consumidor defina
`--ix-font-input`, todo campo de formulario sale monoespaciado**. Si no hace
`@use 'style/fonts/jetbrains-mono'` y no sirve los `.woff2`, la cascada cae al
`monospace` genérico del sistema, que es la fuente menos controlada del stack:
Consolas en Windows, DejaVu Sans Mono en Linux, Menlo en macOS.

Eso ya causó un bug real en LDT (2026-08-22): el guion bajo de un usuario como
`qa_ana` se veía **invisible** en el input, porque cada una de esas fuentes dibuja
`_` a una altura distinta y algunas lo dejan fuera del área visible del campo.
Parecía recorte de CSS y no lo era —la caja tiene 28px para 14px de texto—: era una
fuente que el design system pide y el producto nunca cargó.

La monoespaciada en inputs **es el valor por defecto, y es intencional**: en un
email o una contraseña, distinguir `l` de `1` y `O` de `0` importa. Un
consumidor puede apuntar `--ix-font-input` a otra familia —un producto donde
lo que se escribe son nombres y descripciones, no credenciales—; es su
decisión, y al tomarla deja la desambiguación para los campos que la
necesiten, con `.ix-font-mono`.

**`--ix-font-chrome` es lo mismo para el texto de la interfaz** que hoy va en
mono por estilo y no por necesidad: ítems de navegación, insignias, subtítulo
de tarjeta, rol del usuario, sección de la paleta. Sin definir, mono.

**Los pesos que se piden tienen que existir como archivo.** Los componentes
piden 400, 500, 600 y 700. Inter trae 400, 500 y 600; el 700 cae en el 600,
que es real. Un peso que no existe no falla: el navegador lo fabrica
engordando el más cercano.

**Regla para el consumidor**: si usás `.ix-input`, cargá `fonts/jetbrains-mono` y
copiá `assets/fonts/JetBrainsMono-{Regular,Medium}.woff2` a donde sirvas `/fonts/`.
Con `fonts/inter`, van los **tres**: `Inter-{Regular,Medium,SemiBold}.woff2`.

Colores (vacíos, el consumidor los llena):
            --ix-color-primary, --ix-color-primary-hover, --ix-color-primary-text
            --ix-color-accent, --ix-color-secondary, --ix-color-neutral
            --ix-color-bg, --ix-color-surface, --ix-color-surface-alt
            --ix-color-text, --ix-color-text-muted, --ix-color-text-disabled
            --ix-color-border, --ix-color-border-focus
            --ix-color-danger, --ix-color-success, --ix-color-warning, --ix-color-info
            (y sus variantes -bg, -border, -subtle)
```

## Cómo agregar un componente nuevo

1. **CSS** — crear `style/components/_nombre-componente.scss` con clases `ix-nombre-*`
2. **Aggregator** — agregar `@forward 'components/nombre-componente'` en `style/components.scss`
3. **Svelte** — crear `src/lib/components/categoria/IxNombreComponente.svelte` usando runes
4. **Export** — agregar `export { default as IxNombreComponente } from '...'` en `src/lib/index.ts`
5. **Catálogo** — agregar demo y código de ejemplo en `web/src/routes/inox-ui/+page.svelte` (Didimio)

## Cómo agregar un ícono

Inox UI usa un catálogo inline de íconos Lucide (licencia ISC). Para agregar uno:

1. Agregar una entrada al objeto `ICONS` de `src/lib/icons.ts`, con la forma
   `'nombre-kebab': ['<markup interno del SVG>', 'Etiqueta en español']`. El
   markup admite `<path>`, `<circle>`, `<polyline>` y `<line>` (ver `user-cog`),
   no solo paths. **No** hay que tocar ningún tipo: `ICONS` es
   `Record<string, [string, string]>` y `ICON_NAMES` se deriva de `Object.keys`,
   así que el ícono queda disponible solo.
2. Agregar una demo en la sección "Íconos" del catálogo `/inox-ui`

Los íconos se renderizan via `IxIcon` con `name="nombre-del-icono"` — nunca como archivos SVG externos.

## Regla crítica de universalidad

La capa CSS de Inox UI **no debe asumir nada del framework**. No usar:
- Sintaxis Svelte en archivos `.scss`
- Variables JS/TS en tokens
- `@layer` que rompa la cascada del consumidor

Si una clase necesita comportamiento JS (modal open/close, drawer, toast queue), el CSS define la presentación y el componente Svelte gestiona el estado.

## Accesibilidad (WCAG AA mínimo)

- Todo elemento interactivo tiene `aria-label` o texto visible
- Contraste mínimo 4.5:1 para texto normal, 3:1 para elementos UI y texto grande
- Focus ring visible en todos los interactivos (`--ix-focus-ring`)
- Roles ARIA correctos en modales (`role="dialog"`, `aria-modal="true"`)
- Imágenes decorativas: `aria-hidden="true"` o `alt=""`
- Responsive mobile-first — sin romper en viewport estrecho
