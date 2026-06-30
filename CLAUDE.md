# inox-ui — Contexto para Claude Code

## Qué es Inox UI

Design system de Stahl, v0.1.0. Dos capas completamente independientes:

1. **CSS/SCSS universal** (`style/`) — funciona con cualquier framework o HTML puro. Sin dependencias JS.
2. **Componentes Svelte 5** (`src/lib/`) — consumidos por los productos de Stahl. Requieren Svelte 5.

**La fuente canónica es este repo Git** (`github.com/ruizmarselo94-wq/inox-ui`). No existe un paquete npm publicado aún — los consumidores lo agregan como dependencia Git fijada a un tag o commit (ej. `git+ssh://git@github.com/ruizmarselo94-wq/inox-ui.git#v0.1.0`), no por path ni copia local. Quien modifica Inox UI sube el cambio a `main`; cada consumidor (RustKnight, Bender) decide cuándo actualizar su referencia.

**Versión:** todos los consumidores permanecen en `0.1.0` hasta el primer release conjunto a producción (Inox UI + RustKnight + Bender). Después de ese release, Inox UI versiona independiente como librería; cada producto sigue su propio camino.

## Prefijos

- Clases CSS: `ix-*` — ejemplo: `ix-btn`, `ix-page__header`, `ix-grid-stats`
- Tokens CSS: `--ix-*` — ejemplo: `--ix-sp-4`, `--ix-color-primary`, `--ix-r-md`
- Inox UI **no define colores**. Los tokens `--ix-color-*` son variables vacías. El consumidor (Bender) las llena en su propio archivo de tema.

## Componentes disponibles (17)

**Primitivos** (`src/lib/components/primitives/`):
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
  ix-avatar, ix-avatar--sm/lg
  ix-spinner
  ix-skeleton, ix-skeleton--text/circle/rect
```

## Tokens estructurales (`style/tokens.scss`)

```
Espaciado:  --ix-sp-1/2/3/4/5/6/8/10/12  (4px → 48px)
Radio:      --ix-r-xs/sm/md/lg/xl/full
Fuentes:    --ix-font-ui, --ix-font-brand, --ix-font-mono
Tamaños:    --ix-font-size-xs/sm/md/lg/xl/2xl/3xl/4xl
Sombras:    --ix-shadow-sm/md/lg
Z-index:    --ix-z-base/raised/overlay/modal/toast/topbar
Transición: --ix-t-fast/normal/slow, --ix-ease
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
5. **Catálogo** — agregar demo y código de ejemplo en `web/src/routes/inox-ui/+page.svelte` (Bender)

## Cómo agregar un ícono

Inox UI usa un catálogo inline de íconos Lucide (licencia ISC). Para agregar uno:

1. Copiar los `<path>` del SVG de Lucide a `src/lib/icons.ts` en el objeto `icons`
2. Agregar el nombre al tipo `IconName` en el mismo archivo
3. Agregar una demo en la sección "Íconos" del catálogo `/inox-ui`

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
