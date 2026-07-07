# Changelog — Inox UI

Formato: [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).
Versionado: [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
- `IxInput` ahora soporta `revealable`: en campos `password` agrega un botón
  mostrar/ocultar (clases `ix-input-reveal` / `ix-input-reveal__toggle`).
  Reemplaza el markup custom que `/login` y `/setup` duplicaban.
- Layout `.ix-auth` (`_auth.scss`): split-screen de dos columnas para
  pantallas públicas — `.ix-auth__aside`, `.ix-auth__panel`, `.ix-auth__card`,
  `.ix-auth__title`, `.ix-auth__error`, `.ix-auth__form`. Reemplaza el grid
  `.bn-login`/`.bn-setup` que Bender duplicaba en `/login` y `/setup`.
- Íconos `hard-drive` y `rocket` al catálogo Lucide (`src/lib/icons.ts`).
  Consumidos por el onboarding de Bender. Aparecen automáticamente en el
  catálogo `/inox-ui` vía `ICON_NAMES`.
- Utilidad `.ix-icon-box` (`_icon-box.scss`): contenedor de ícono con fondo
  suave + color saturado a juego, para feature cards / destacados. Variantes
  `--primary/--accent/--neutral/--success/--danger/--warning/--info`, todas
  vía tokens `--ix-color-*-subtle`/`-bg` ya existentes (mismo mecanismo que
  `IxBadge`, sin `color-mix()`).
- `IxBtnOauth` (`primitives/IxBtnOauth.svelte`): encapsula el botón OAuth
  sobre `.ix-btn-oauth` — el SVG de marca vive en el componente, no en cada
  consumidor. Providers soportados hoy: `google`, `github` (los únicos con
  logo verificado; el CSS ya tiene tratamiento hover para facebook/vk pero
  el componente no les inventa un ícono hasta tener el SVG confirmado).
  Prop `disabled` para "proveedor visible, todavía no wireado" (`aria-disabled`
  + `tabindex="-1"`, sin `href`). El `href` lo decide el consumidor — el
  componente no asume ninguna convención de ruteo de backend.
- `.ix-divider` (`_divider.scss`): separador con texto centrado (línea a
  cada lado). Utilidad CSS pura, sin componente Svelte — mismo criterio que
  `.ix-icon-box`.

### Changed
- Renombrados los temas opt-in a inglés, consistente con el resto de nombres
  de archivo del repo: `_tema-neutro.scss` → `_theme-neutral.scss`,
  `_tema-oscuro.scss` → `_theme-dark.scss`. Actualizar los `@use
  'inox-ui/style/themes/tema-*'` existentes a `theme-neutral`/`theme-dark`.

### Fixed
- `ix-label` e `ix-input`/`ix-select`/`ix-textarea`: font-size hardcodeado
  (0.85rem y 0.92rem respectivamente, fuera de la escala de tokens)
  reemplazado por `--ix-font-size-md` en ambos — quedan igualados en tamaño
  (un label más chico que su input invierte la jerarquía visual).
- `a:focus-visible` global (`_reset.scss`): cualquier link suelto (no
  `.ix-btn`/`.ix-btn-oauth`) caía al outline azul por defecto del
  navegador. Ahora usa el mismo anillo de marca (`--ix-color-border-focus`)
  que ya tenían botones e inputs. Consistencia visual, no un fix de
  accesibilidad — WCAG 2.4.7 ya se cumplía con el outline nativo.

---

## [0.1.0] — 2026-05-19

Primera versión de Inox UI como design system CSS/SCSS universal
más componentes Svelte 5. Punto de partida del sistema — no hay
versiones anteriores.

---

### Capa CSS/SCSS universal

El CSS de Inox UI es independiente del framework. Funciona con
cualquier proyecto HTML/JS/TS que importe `style/main.scss`.

#### Tokens (`tokens.scss`)

Todos los tokens usan el prefijo `--ix-`. Inox UI **no asigna
valores cromáticos** — cada proyecto consumidor define su tema.

- **Espaciado** — escala 4 px: `--ix-sp-1` … `--ix-sp-12` (0.25 rem … 3 rem).
- **Radios** — `--ix-r-xs/sm/md/lg/xl/full` + alias `--ix-radius-*`.
- **Transiciones** — `--ix-t-fast` (100 ms), `--ix-t-normal` (200 ms), `--ix-t-slow` (300 ms), `--ix-ease`.
- **Tipografía — roles** — `--ix-font-wordmark/brand/ui/mono/ubuntu/ubuntu-mono`.
  Los `@font-face` viven en `style/fonts/` y son opt-in.
- **Tipografía — escala** — `--ix-font-size-xs … 4xl` en `rem`.
  Base: `1 rem = 13 px` (`html { font-size: 81.25% }`). Escala con las
  preferencias de tamaño del navegador (WCAG 1.4.4).
- **Layout** — `--ix-sidebar-w` (220 px), `--ix-sidebar-w-col` (52 px),
  `--ix-topbar-h` (48 px), `--ix-container-xl` (1280 px), `--ix-page-padding`.
- **Z-index** — `--ix-z-base/raised/overlay/modal/toast/topbar` (0 → 400).
- **Colores semánticos** (estructura sin valores):
  - Primario: `--ix-color-primary/hover/text/subtle`.
  - Secundario: `--ix-color-secondary/hover/text`.
  - Acento: `--ix-color-accent/hover/text/subtle`.
  - Neutral: `--ix-color-neutral/text`.
  - Estado: `success/danger/warning/info` — cada uno con `-bg` y `-border`.
  - Superficies: `--ix-color-bg/surface/surface-alt/surface-raised/overlay`.
  - Texto: `--ix-color-text/muted/disabled/inverse/inverse-muted`.
  - Bordes: `--ix-color-border/border-focus/border-strong`.
  - Sombras: `--ix-shadow-sm/md/lg`.
  - Auxiliares: `--ix-color-backdrop`, `--ix-color-skeleton-base/shine`,
    `--ix-color-ghost-hover-bg/border`, `--ix-focus-ring`.

#### Reset y base (`_reset.scss`)

- `html { font-size: 81.25% }` — base rem proporcional.
- `box-sizing: border-box` universal.
- Normalize mínimo: márgenes, padding, herencia de fuente.

#### Componentes CSS (`style/components/` — 21 parciales)

| Parcial | Clase raíz | Notas |
|---|---|---|
| `_avatar.scss` | `.ix-avatar` | Variantes `--sm/md/lg` |
| `_badge.scss` | `.ix-badge` | Variantes `--ok/warn/err/info/neutral` |
| `_btn.scss` | `.ix-btn` | Variantes `--primary/secondary/outline/ghost/danger`; tamaños `--sm/md/lg`; `--full`; `min-height: 44px` (WCAG 2.5.5) |
| `_btn.scss` | `.ix-btn-icon` | Botón cuadrado 28×28 para íconos; variante `--danger` |
| `_btn-oauth.scss` | `.ix-btn-oauth` | Botones de login social: GitHub, Google, Facebook, VK |
| `_card.scss` | `.ix-card` | Contenedor de superficie con borde y sombra |
| `_forms.scss` | `.ix-field`, `.ix-label`, `.ix-input`, `.ix-select`, `.ix-textarea`, `.ix-req` | `.ix-select-wrapper::after` provee la flecha CSS pura |
| `_grid.scss` | `.ix-grid`, `.ix-grid-2`, `.ix-grid-stats` | Grids semánticos |
| `_layout.scss` | `.ix-page-slot`, `.ix-main-container` | Zonas del shell |
| `_modal.scss` | `.ix-modal` | Diálogo con backdrop |
| `_page.scss` | `.ix-page` | Cabecera de página con título y acciones |
| `_reset.scss` | — | Normalize base |
| `_shell.scss` | `.ix-shell`, `.ix-shell__backdrop` | Contenedor raíz; backdrop mobile |
| `_sidebar.scss` | `.ix-sidebar`, `.ix-nav`, `.ix-nav-item` | Drawer móvil con `transform` + `--mobile-open`; colapso escritorio |
| `_skeleton.scss` | `.ix-skeleton` | Placeholder animado para carga |
| `_spinner.scss` | `.ix-spinner`, `.ix-spinner__ring` | Variantes `--sm/md/lg`; tamaño vía `--ix-spinner-size` |
| `_stat-card.scss` | `.ix-stat-card` | Tarjeta de métrica con valor, tendencia y delta |
| `_table.scss` | `.ix-table`, `.ix-table-wrap`, `.ix-table-loading` | Scroll horizontal; filas hover; celdas mono |
| `_toast.scss` | `.ix-toast`, `.ix-toast-container` | Fijo en esquina inferior derecha; variantes `--ok/warn/err/info` |
| `_toggle.scss` | `.ix-toggle`, `.ix-toggle-row` | Estados via `:has(input:checked/disabled/focus-visible)`; sin JS |
| `_topbar.scss` | `.ix-topbar`, `.ix-breadcrumb` | Modo sidebar (breadcrumb) y modo topbar (nav + brand); hamburguesa mobile |
| `_utility.scss` | `ix-hidden`, `ix-flex`, `ix-grid`, … | Clases atómicas: display, flex, gap, width, overflow, posición, tipografía, color, fondo, borde, radio, accesibilidad (`ix-sr-only`) |

#### Temas opt-in (`style/temas/`)

- `_tema-neutro.scss` — grises minimalistas, sin color de marca.
- `_tema-oscuro.scss` — dark mode universal.

Cada proyecto consumidor puede ignorar estos temas y proveer el
suyo propio (p. ej. `bender-tema.scss`). Las propiedades de color
se aplican via `[data-theme="dark/light"]` en el `<html>` raíz.
Fallback sin JS: `@media (prefers-color-scheme)` con `:root:not([data-theme])`.

---

### Capa Svelte 5 (`src/lib/`)

Todos los componentes usan la API de Svelte 5: runes (`$state`,
`$derived`, `$props`, `$bindable`), snippets (`{@render}`),
eventos inline (`onclick`). Sin stores `writable/readable`.

#### Primitivos

| Componente | Props clave |
|---|---|
| `IxBadge` | `variant` (ok/warn/err/info/neutral) |
| `IxBtn` | `variant`, `size`, `full`, `disabled`, `href`, `onclick`; acepta snippet `children` |
| `IxBtnIcon` | `danger`, `disabled`, `title`, `onclick`; acepta snippet `children` |
| `IxCard` | Snippet `children`; clase extra via `class` |
| `IxIcon` | `name` (del catálogo `icons.ts`), `size`, `ariaHidden`, `ariaLabel` |
| `IxSpinner` | `size` (px), `label` (para screen readers), variantes CSS `--sm/md/lg` |

#### Formularios

| Componente | Props clave |
|---|---|
| `IxInput` | `label`, `value` ($bindable), `type`, `placeholder`, `hint`, `error`, `required`, `disabled` |
| `IxSelect` | `label`, `value` ($bindable), `options` (`{value, label}[]`), `hint`, `error`, `required`, `disabled` |
| `IxToggle` | `checked` ($bindable), `disabled`, `ariaLabel` |
| `IxToggleRow` | `label`, `description`, `checked` ($bindable), `disabled` |

#### Layout

| Componente | Props clave |
|---|---|
| `IxShell` | `nav`, `usuario`, `titulo`, `subtitulo`, `onCerrarSesion`; snippets `actions`, `children` |
| `IxSidebar` | `nav` (`NavSection[]`), `usuario`; interactúa con `ShellContext` |
| `IxTopbar` | `nav`, `usuario`, `titulo`, `subtitulo`, `onCerrarSesion`; snippet `actions` |

`IxShell` provee el contexto de shell. `IxSidebar` e `IxTopbar`
lo consumen via `useShell()`.

#### Datos

| Componente | Props clave |
|---|---|
| `IxDataTable<T>` | `columns` (`DataColumn<T>[]`), `rows` (`T[]`), `loading`, `emptyText`; snippet `actions` por fila |
| `IxStatCard` | `titulo`, `valor`, `delta`, `tendencia` (up/down/flat), `icono`, `descripcion` |

#### Feedback

| Componente | Rol |
|---|---|
| `IxToastProvider` | Monta el contenedor `.ix-toast-container` y provee el contexto de toast |
| `IxToast` | Renderiza un toast individual; animación entrada CSS |

#### Composables y contextos

**`shell.svelte.ts` — `ShellContext`**
- `tema` (`'dark' | 'light'`) — aplica `data-theme` en `<html>`.
- `layout` (`'sidebar' | 'topbar'`) — aplica `data-layout` en el shell.
- `colapsado` — sidebar colapsado en escritorio.
- `mobileAbierto` — drawer sidebar abierto en mobile.
- Métodos: `toggleTema()`, `toggleLayout()`, `toggleColapsado()`, `toggleMobile()`, `cerrarMobile()`.

**`toast.svelte.ts` — `ToastContext`**
- `useToast()` — devuelve `{ ok, warn, err, info }` para disparar notificaciones.
- `provideToast()` — inicializa el contexto (llamado por `IxToastProvider`).
- Duración configurable; cola de toasts reactiva con `$state`.

#### Catálogo de íconos (`icons.ts`)

Íconos SVG inline del set Lucide (licencia ISC). Disponibles via
`IxIcon name="..."`. Exporta `ICON_NAMES`, `getIconPaths()`,
`getIconLabel()`.

---

### Accesibilidad

- `focus-visible` en todos los elementos interactivos (botones, inputs,
  nav items, toggles, collapse button). Sin `outline: none` sin reemplazo.
- Escala tipográfica en `rem` completa — respeta zoom y preferencias
  del sistema operativo (WCAG 1.4.4).
- `min-height: 44px` en `.ix-btn` (WCAG 2.5.5 — touch target).
- `.ix-sr-only` para contenido exclusivo de lectores de pantalla.
- `IxToggle` usa `<input type="checkbox" role="switch">` nativo;
  estados vía `:has()` sin JS adicional.
- `IxSpinner` incluye `role="status"` y `aria-label` configurable.
- `IxTopbar` hamburger con `aria-label` dinámico según estado del drawer.
