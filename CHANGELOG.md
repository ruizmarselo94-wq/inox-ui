# Changelog — Inox UI

Formato: [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).
Versionado: [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

## [0.1.5] — 2026-08-08

Un solo anillo de foco para todo lo enfocable, heredado, en vez de uno por
componente. Convivían **cuatro variantes** del mismo anillo dentro de la propia
librería (con halo, sin halo, `outline: none` + halo, offset de 1px) y cada
consumidor sumaba las suyas encima.

El problema no era la repetición sino su consecuencia: **elegir el color quedaba
a criterio de quien escribía el componente**. Caso real en un consumidor: un
control tomó el rojo luminoso pensado para fondos oscuros, terminó sobre un
fondo claro y dio 2.90:1 — por debajo del 3:1 de WCAG 1.4.11. Con el anillo
heredado ese componente no habría tenido motivo para declarar foco.

### Changed
- `_reset.scss` define el anillo canónico para
  `a, button, summary, input, select, textarea, [tabindex]`, en **`:where()`**
  (especificidad cero): es un piso, no una imposición, y cualquier componente lo
  pisa sin `!important`.
- El anillo es de **dos tonos** (`--ix-focus-ring` como halo claro + `outline`
  por fuera). Funciona sobre cualquier fondo porque el borde entre los dos
  tonos siempre existe: sobre claros contrasta el outline, sobre oscuros el
  halo. Un color solo no puede garantizar eso.
- `.ix-btn`, `.ix-btn-icon`, `.ix-btn-oauth` y `.ix-modal` dejan de declarar
  foco: heredan. Se conservan solo las definiciones que **realmente difieren** —
  anillos internos (`outline-offset: -2px`) en sidebar y topbar, offset de 1px
  en inputs, el radio del botón desnudo de `_forms`, y el `:has()` del toggle
  (su input está oculto, así que el anillo va en el envoltorio).

### Notes
- ⚠️ El halo se dibuja con `box-shadow` y por lo tanto **reemplaza** la sombra
  en reposo de un control que tenga una. Si hay que conservarla, componer:
  `box-shadow: <su sombra>, var(--ix-focus-ring)`.

## [0.1.4] — 2026-08-07

El borde de los botones sin relleno pasa a cumplir WCAG 1.4.11. En un
consumidor (LDT) se midió el borde de `outline`/`ghost`/`btn-icon` en **1.42:1**
contra la superficie —menos de la mitad del 3:1 exigido— y el estado *hover* en
2.11:1, o sea que el hover era todavía menos visible que el mínimo. El texto de
esos botones pasaba de sobra: lo que no se leía era el botón COMO botón.

### Added
- `--ix-color-border-interactive` y `--ix-color-border-interactive-strong`
  (hover). Existen separados de `--ix-color-border`/`-strong` a propósito: esos
  son bordes **estructurales** —tarjetas, reglas de tabla, divisores—, son
  decorativos y NO caen bajo 1.4.11, así que subirlos para arreglar los botones
  habría engrosado cada línea fina del producto. El token nuevo cubre solo el
  borde que **identifica** un control cuando es su única identidad visual.
- `--ix-color-danger-border-interactive`, por lo mismo en rojo: el relleno de
  un botón `danger` es un lavado translúcido que ronda 1.2:1, así que quien
  identifica al control es el borde. `--ix-color-danger-border` se queda como
  está porque además dibuja avisos y badges CON relleno (`.ix-badge--err`, la
  caja de error de `_auth`), que no caen bajo 1.4.11 y deben poder quedarse
  suaves — subirlo habría puesto un contorno rojo pesado en cada badge.
- Valores en los dos temas propios, medidos sobre bg/surface/surface-alt de
  cada uno: neutral 3.04/3.07/3.02 (hover 4.61/4.67/4.53), danger
  3.10/3.24/3.01; dark 3.17/3.17/3.03 (hover 5.08/4.89/4.55), danger
  3.63/3.36/3.00.

### Changed
- `.ix-btn--outline`, `.ix-btn--ghost` y `.ix-btn-icon` consumen el token nuevo
  **con fallback** (`var(--ix-color-border-interactive, var(--ix-color-border))`),
  así que un tema que no lo defina se comporta exactamente como antes. No hay
  breaking change.

## [0.1.3] — 2026-08-01

La API pública de los componentes queda íntegramente en inglés americano —
props en español eran una fuga del idioma de un consumidor dentro de la
librería, y obligaban a todo producto nuevo a mezclar idiomas en sus templates.

### Changed
- **Props renombradas (breaking):** `IxSelect` `opciones` → `options`;
  `IxStatCard` `valor`/`unidad`/`subtexto`/`acento` →
  `value`/`unit`/`subtext`/`accent`. Tipos internos `OpcionSelect` →
  `SelectOption`, `AcentoColor` → `StatAccent`. Los consumidores pinean por
  SHA — nadie se rompe sin bumpear.
- Identificadores internos en inglés: `avatarLetra` → `avatarInitial`
  (IxTopbar, IxSidebar), `esActivo` → `isActive`, `seccion` → `section`
  (IxSidebar). Sin cambio de comportamiento.

### Added
- `.ix-row--inactive` en `_table.scss` — fila apagada para registros
  inactivos; los consumidores la redefinían localmente en cada página.

## [0.1.2] — 2026-08-01

El sistema de temas vuelve a su forma universal: **dos temas, `dark` y
`light`**, sin dimensión de acento. Los temas extra y los acentos que se
acumularon eran identidad de un consumidor filtrada dentro de la librería —
nombres de tema y valores hex de un producto no pueden vivir en Inox UI. Cada
producto define su paleta en su propio archivo de tema (`--ix-color-*` bajo
`[data-theme]`); la librería solo conoce el par semántico oscuro/claro.

### Changed
- **`Theme` es `'dark' | 'light'`** (antes incluía tres temas de producto).
  `AccentColor` se elimina, junto con `data-accent`, `shell.setAccent()` y la
  clave `accent` de `localStorage`. Breaking para quien usara esos valores;
  los consumidores pinean por SHA, así que nadie se rompe sin bumpear.
- **`IxThemePicker` pasa de panel desplegable a toggle** sol/luna
  (`shell.toggleTheme()`). Un botón `ix-btn-icon` simple: con dos temas, un
  panel con grupos, backdrop y swatches era sobre-ingeniería. El CSS del panel
  (`.ix-theme-picker__*`) se elimina de `_topbar.scss`.
- `shell.loadFromStorage()` solo acepta `dark`/`light` como valores guardados
  de `theme`; cualquier otro valor persistido cae al default.

## [0.1.1] — 2026-07-25

Primer release desde que RustKnight/LDT salió a producción. Cierra el ciclo de
`IxAvatar` (el consumidor visual que ADR-0011 de LDT esperaba para poblar la
foto de perfil) y publica todo lo que se venía acumulando en `[Unreleased]`, que
ya estaba corriendo en prod vía pin por commit. Desde acá Inox UI versiona
independiente de los consumidores, con pasos incrementales simples (`0.1.x`)
mientras se sientan las bases.

### Changed
- `IxAvatar`: `src` acepta `string | null | undefined` (antes solo
  `string | undefined`). Los DTOs de los consumidores exponen `avatar_url` como
  `string | null`, así que cada call site necesitaba un `?? undefined`. Amplía lo
  aceptado, no rompe nada.
- `IxIcon`: agregado `user-plus` (persona + signo más, Lucide). Es el ícono
  canónico de "agregar contacto/amigo" y era un hueco real de la familia
  `user-*`, que tenía `check`, `cog`, `edit` y `x` —aprobar, configurar, editar,
  quitar— pero no **agregar**, la operación más común de una capa social.
  Sigue la generación de sus hermanos (`user-check`/`user-x`: torso clásico +
  `<line>`), no la variante nueva de Lucide, para que el trazo case con el set.
- `IxIcon`: agregado `user-edit` (persona + lápiz, Lucide `user-pen`). El set no
  tenía un ícono de editar-identidad — solo `pencil` genérico, `cog` y
  `settings`; `user-cog` era lo más cercano pero comunica "configuración". LDT lo
  usa en el botón "Editar perfil". Aparece automáticamente en `ICON_NAMES`.
- El script `build` pasa a ser un alias de `package`. Antes corría
  `vite build && npm run package`, y `vite build` **fallaba siempre**
  (`src/app.html does not exist`): Inox UI es una librería, no una app, y nadie
  consume la salida de Vite. `package` (`svelte-package` + `publint`) queda como
  el comando canónico.
- `@sveltejs/kit` pasa a `peerDependencies`. La librería importa `$app/*`
  (`IxTopbar`, `IxSidebar`, `IxNotificationBell`), así que SvelteKit lo provee el
  consumidor — `svelte-package` lo reportaba como dependencia no declarada.
- `tsconfig.json` extiende `./.svelte-kit/tsconfig.json` y deja de declarar
  `include`/`types` propios. Sin eso los tipos ambientales de `$app/*` no
  resolvían (y un `include` local los habría vuelto a tapar, porque reemplaza el
  del generado en vez de sumarse).

### Added
- **`src/app.html`** (causa raíz del build roto): `svelte-kit sync` lo exige para
  generar `.svelte-kit/`, y sin él fallaban `npm run package` **y**
  `npm run check`. Nadie sirve ese HTML —Inox UI es solo `src/lib/`—; existe por
  el mismo motivo por el que lo incluye la plantilla de librería de SvelteKit.
- **CI** (`.github/workflows/ci.yml`): en push y PR a `main` corre `check`
  (svelte-check) y `package`. El repo no tenía ninguno, y como los consumidores
  usan la **fuente**, nada impedía que un error de tipos llegara a LDT al bumpear
  el pin. Sin `lint` (el script existe pero prettier/eslint no están instalados)
  y sin `npm ci`/`cache: npm` (no hay lockfile).

### Fixed
- `IxSidebar`: `pathname` se tipa explícitamente como `string`. SvelteKit lo tipa
  según la tabla de rutas del proyecto y esta librería no tiene rutas propias, así
  que quedaba como ``"/" | `/${string}/` `` y comparar con una ruta del consumidor
  (`'/dashboard'`) se reportaba como "sin solapamiento". Para una librería el
  pathname **es** un string arbitrario. El error estaba latente: solo se hizo
  visible cuando los tipos de `$app/*` empezaron a resolver.

### Fixed
- `IxModal`: el `::backdrop` ahora hace fade-in con el mismo timing/easing que
  la caja (`ix-modal-in`). Antes el fondo oscuro aparecía de golpe mientras la
  caja entraba suave — esa disonancia se leía como un "pestañeo" chocante al
  abrir. Se agregó además respeto a `prefers-reduced-motion` (sin animación de
  entrada para quien lo prefiere).

### Added
- `IxAvatar` (`primitives/IxAvatar.svelte`): componente de avatar con foto +
  fallback a inicial. Props: `name` (requerido — deriva inicial y texto
  accesible), `src?` (URL de foto), `size?` (`sm/md/lg`), `alt?`, `class?`.
  Muestra la `<img>` si hay `src` y carga bien (circular, `object-fit: cover`,
  no deforma fotos no cuadradas); si no hay `src` **o la imagen falla al cargar**
  (`onerror`), cae a la inicial sobre el gradiente de marca — clave para URLs de
  proveedor (Google/GitHub) que pueden morir sin dejar el avatar roto. Reutiliza
  `.ix-avatar` (se le sumó `overflow: hidden` para recortar la foto, más
  `.ix-avatar__img`); los avatares solo-inicial existentes no cambian.
  Accesible: `alt` en la imagen, `role="img"`+`aria-label` en la inicial (o
  `aria-hidden` si `alt=""`). Reemplaza las copias inline del círculo que los
  consumidores (LDT: perfil/topbar/mini-perfil) hoy duplican.
- `IxInput`: props `min`/`max`/`step`/`inputmode` (reenviadas al `<input>`) y
  modo `stepper` para `type="number"`. `stepper` reemplaza las flechas nativas
  (feas e inconsistentes entre navegadores) por botones −/+ que respetan
  `min`/`max`/`step` (clases `.ix-stepper` / `.ix-stepper__btn`); el input sigue
  operable por teclado. Antes el number no podía acotarse (aceptaba negativos).
  LDT lo usa en la cadencia de partida; cualquier consumidor con campos
  numéricos lo hereda.
- `.ix-avatar--lg` (40px, font-size 1.08rem): tercer tamaño de avatar, sigue
  la misma proporción que `--sm`/`--md`. LDT lo usa en el mini-perfil del
  lobby.
- `IxIcon`: agregados `cpu` y `swords` (Lucide). LDT los usa en el lobby
  ("Contra la máquina" = motor de cálculo; "Contra un amigo" = duelo).
  Shijima/Cthulhu los heredan automáticamente vía el set compartido.
- `IxModal` (`primitives/IxModal.svelte`): diálogo modal sobre `<dialog>`
  nativo — `showModal()` aporta top-layer, focus-trap, Esc y `::backdrop`
  sin JS extra. Props: `open` (bindable), `title`, `size` (`sm/md/lg/xl`),
  `onclose`, snippet `footer`. Reutiliza la caja `.ix-modal` que ya vivía en
  `_modal.scss`; se agregó `dialog.ix-modal` + `::backdrop` + botón
  `.ix-modal__close`. Cierra por Esc, clic en el backdrop o el botón. LDT lo
  usa para configurar partida (vs-máquina / desafío a un amigo); Shijima
  también lo va a necesitar.
- Ícono `robot` al catálogo Lucide (`src/lib/icons.ts`). Para "Contra la
  máquina" en LDT. Aparece automáticamente en el catálogo vía `ICON_NAMES`.
- `IxInput` ahora soporta `revealable`: en campos `password` agrega un botón
  mostrar/ocultar (clases `ix-input-reveal` / `ix-input-reveal__toggle`).
  Reemplaza el markup custom que `/login` y `/setup` duplicaban.
- Layout `.ix-auth` (`_auth.scss`): split-screen de dos columnas para
  pantallas públicas — `.ix-auth__aside`, `.ix-auth__panel`, `.ix-auth__card`,
  `.ix-auth__title`, `.ix-auth__error`, `.ix-auth__form`. Reemplaza el grid
  `.sh-login`/`.sh-setup` que Shijima duplicaba en `/login` y `/setup`.
- Íconos `hard-drive` y `rocket` al catálogo Lucide (`src/lib/icons.ts`).
  Consumidos por el onboarding de Shijima. Aparecen automáticamente en el
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
- `IxInput`: `autofocus` deja de ser el atributo HTML nativo — ahora se
  aplica en JS al montar, y **solo si el dispositivo no es touch**
  (`hover: none` + `pointer: coarse`). Antes disparaba el teclado virtual
  apenas cargaba la página en mobile, sin que el usuario hiciera nada.

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
suyo propio (p. ej. `shijima-tema.scss`). Las propiedades de color
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
