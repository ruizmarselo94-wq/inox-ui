# inox-ui — Contexto para Claude Code

## Qué es Inox UI

Design system de Stahl. Dos capas completamente independientes:

1. **CSS/SCSS universal** (`style/`) — funciona con cualquier framework o HTML puro. Sin dependencias JS.
2. **Componentes Svelte 5** (`src/lib/`) — consumidos por los productos de Stahl. Requieren Svelte 5.

**La fuente canónica es este repo Git** (`github.com/stahlsoft/inox-ui`). No existe un paquete npm publicado aún — los consumidores lo agregan como dependencia Git fijada a un tag o commit (ej. `git+ssh://git@github.com/stahlsoft/inox-ui.git#<sha>`), no por path ni copia local. Quien modifica Inox UI sube el cambio a `main`; cada consumidor (RustKnight, Shijima) decide cuándo actualizar su referencia.

**Versión:** `0.1.2`. Inox UI versiona de forma **independiente** de LDT/RustKnight y de los demás proyectos. Durante la etapa de bases se usa **versionado incremental simple** (`0.1.x`) por conveniencia — pasos chicos, sin semver estricto. **Revisar y formalizar la política de versionado cuando un segundo proyecto (Shijima) consuma Inox UI en producción**: ese es el disparador, igual que los usuarios reales dispararon el flujo de ramas en RustKnight.

La versión es **informativa**: los consumidores pinean por **commit SHA** (no por rango de versión), así que describe el estado de la librería, no controla la resolución.

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
Tamaños:    --ix-font-size-xs/sm/md/lg/xl/2xl/3xl/4xl
Sombras:    --ix-shadow-sm/md/lg
Z-index:    --ix-z-base/raised/overlay/modal/toast/topbar
Transición: --ix-t-fast/normal/slow, --ix-ease
⚠️ **Las fuentes son opt-in, pero `--ix-font-mono` NO es opcional si usás formularios.**
`_forms.scss` aplica `font-family: var(--ix-font-mono)` a `.ix-input`, `.ix-select`
y `.ix-textarea` — o sea que **todo campo de formulario sale monoespaciado**. Si el
consumidor no hace `@use 'style/fonts/jetbrains-mono'` y no sirve los `.woff2`, la
cascada cae al `monospace` genérico del sistema, que es la fuente menos controlada
del stack: Consolas en Windows, DejaVu Sans Mono en Linux, Menlo en macOS.

Eso ya causó un bug real en LDT (2026-08-22): el guion bajo de un usuario como
`qa_ana` se veía **invisible** en el input, porque cada una de esas fuentes dibuja
`_` a una altura distinta y algunas lo dejan fuera del área visible del campo.
Parecía recorte de CSS y no lo era —la caja tiene 28px para 14px de texto—: era una
fuente que el design system pide y el producto nunca cargó.

La monoespaciada en inputs **es intencional**: en un email o una contraseña,
distinguir `l` de `1` y `O` de `0` importa. Por eso la respuesta correcta es cargar
la fuente, no sacarla del componente.

**Regla para el consumidor**: si usás `.ix-input`, cargá `fonts/jetbrains-mono` y
copiá `assets/fonts/JetBrainsMono-{Regular,Medium}.woff2` a donde sirvas `/fonts/`.

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
5. **Catálogo** — agregar demo y código de ejemplo en `web/src/routes/inox-ui/+page.svelte` (Shijima)

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
