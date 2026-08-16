# Inox UI

Design system de Stahl. **Estructura sin color: la identidad la pone cada producto.**

Provee tokens CSS, clases `ix-*` y componentes Svelte 5 para construir
interfaces consistentes en todos los productos del estudio. **La fuente
canónica es este repo** (`github.com/stahlsoft/inox-ui`). Los consumidores
(RustKnight, Shijima) lo agregan como dependencia Git fijada a un tag o
commit — no hay paquete npm publicado todavía.

- Prefijo de clases CSS: `ix-`
- Prefijo de tokens CSS: `--ix-`
- Versión: `0.1.x` incremental durante la etapa de bases, sin semver estricto.

---

## Las dos capas

Inox UI se consume en dos capas **independientes**:

1. **Capa CSS/SCSS universal** (`style/`) — tokens y clases `ix-*` que funcionan
   con cualquier framework JS/TS o HTML puro. Sin dependencias JS. Se importa vía
   SCSS.
2. **Capa de componentes Svelte 5** (`src/lib/`) — componentes `Ix*` con props
   tipadas (TypeScript strict). Solo para apps Svelte 5. Usan runes (`$state`,
   `$derived`, `$props`, `$bindable`), snippets (`{@render}`) y eventos inline
   (`onclick`) — sin stores `writable`/`readable`.

Las dos pueden usarse juntas o por separado.

---

## Agregar a un proyecto

Inox UI se declara como dependencia Git fijada (`@stahl/inox-ui`, ver
"Distribución y versioning") y se importa directo:

```ts
// Componentes Svelte
import { IxBtn, IxInput, IxShell, IxIcon } from '@stahl/inox-ui';
import type { NavSection, Theme } from '@stahl/inox-ui';
```

```scss
// Capa CSS universal completa
@use '@stahl/inox-ui/style/main';

// Fuentes opt-in (solo las que el proyecto usa)
@use '@stahl/inox-ui/style/fonts/inter';
@use '@stahl/inox-ui/style/fonts/jetbrains-mono';
```

Imports SCSS selectivos (solo los componentes que el proyecto realmente usa —
recomendado para reducir el CSS final):

```scss
@use '@stahl/inox-ui/style/tokens';
@use '@stahl/inox-ui/style/components/reset';
@use '@stahl/inox-ui/style/components/btn';
@use '@stahl/inox-ui/style/components/forms';
// ...solo los parciales que necesités
```

El orden importa: `tokens` define las variables, el tema del consumidor las
sobreescribe, y `components` las consume.

---

## Estructura de estilos (`style/`)

```
style/
├── main.scss            # entrada universal (tokens + components + utilities)
├── tokens.scss          # variables CSS (--ix-*) — sin valores cromáticos
├── _utilities.scss      # clases atómicas ix- (display, flex, tipografía, color)
├── components.scss      # agregador @forward de cada parcial
├── components/          # un parcial por componente, importable suelto
│   ├── _reset.scss      _shell.scss      _sidebar.scss    _topbar.scss
│   ├── _layout.scss     _page.scss       _grid.scss       _card.scss
│   ├── _btn.scss        _btn-oauth.scss  _badge.scss      _flag.scss
│   ├── _forms.scss      _toggle.scss     _table.scss      _stat-card.scss
│   ├── _spinner.scss    _skeleton.scss   _avatar.scss     _modal.scss
│   ├── _toast.scss      _states.scss     _notification-bell.scss
│   ├── _icon-box.scss
├── themes/              # temas universales opt-in
│   ├── _theme-neutral.scss # grises minimalistas, sin color de marca
│   └── _theme-dark.scss    # dark mode universal
└── fonts/               # catálogo opt-in, un parcial por familia
    ├── _inter.scss      _jetbrains-mono.scss   _ubuntu.scss
    └── _pirata-one.scss _eb-garamond.scss
```

Cada proyecto puede ignorar los temas de `themes/` y proveer el suyo (Shijima usa
`web/src/styles/base/shijima-tema.scss`). Las propiedades de color se aplican vía
`[data-theme="dark"|"light"]` en el `<html>` raíz.

---

## Componentes Svelte (25)

Todos se importan desde la raíz del paquete (`@stahl/inox-ui`) y son componentes
Svelte 5. Detalle de props en el catálogo en vivo `/inox-ui` y en `CHANGELOG.md`.

| Categoría | Componentes |
|---|---|
| **Primitivos** | `IxAvatar`, `IxBadge`, `IxBtn`, `IxBtnIcon`, `IxBtnOauth`, `IxCard`, `IxIcon`, `IxModal`, `IxNotificationBell`, `IxSpinner`, `IxThemePicker` |
| **Formularios** | `IxInput`, `IxInputTel`, `IxSelect`, `IxToggle`, `IxToggleRow` |
| **Layout** | `IxShell`, `IxSidebar`, `IxTopbar` |
| **Datos** | `IxBarChart`, `IxDataTable`, `IxStatCard` |
| **Feedback** | `IxToast`, `IxToastProvider` |

**Composables y contextos:**
- `provideShell()` / `useShell()` → `ShellContext` (tema, layout, colapso sidebar,
  drawer mobile).
- `provideToast()` / `useToast()` → `ToastContext` (`{ ok, warn, err, info }`).

**Tipos exportados:** `Theme` (`dark | light`), `LayoutMode`, `BadgeVariant`,
`BtnVariant`, `BtnSize`, `ToastKind`, `NavItem`, `NavSection`, `UserProfile`,
`DataColumn`, `AlertItem`, `AlertVariant`.

### Icon box

`.ix-icon-box` — contenedor de ícono con fondo suave + color saturado a
juego (patrón sidebar-icon de feature cards / destacados). El color sale de
los tokens de tema del consumidor, nunca hardcodeado:

```svelte
<div class="ix-icon-box ix-icon-box--primary">
  <IxIcon name="rocket" ariaHidden />
</div>
```

Variantes: `--primary | --accent | --neutral | --success | --danger |
--warning | --info`. Reusan los mismos tokens `-subtle`/`-bg` que ya define
`IxBadge` — no hay `color-mix()` de por medio. `IxIcon` usa
`stroke="currentColor"`, así que el ícono hereda el color del contenedor sin
props extra.

### IxBtn (ejemplo)

```svelte
<script lang="ts">
  import { IxBtn, IxIcon } from '@stahl/inox-ui';
</script>

<IxBtn variant="primary" full onclick={guardar}>
  <IxIcon name="check" size={16} ariaHidden /> Guardar
</IxBtn>
```

Variantes: `primary | outline | secondary | ghost | danger`. Tamaños:
`sm | md | lg` (default `md`). El contenido se alinea vía `inline-flex` con `gap`.

---

## Íconos

Catálogo SVG inline del set **Lucide (licencia ISC)**, sin peticiones HTTP. Se
renderizan vía el componente `IxIcon`, nunca como archivos SVG externos:

```svelte
<IxIcon name="rocket" size={16} ariaHidden />
<IxIcon name="check" size={20} ariaLabel="Confirmado" />
```

API del módulo `icons.ts`: `ICON_NAMES` (lista), `getIconPaths(name)`,
`getIconLabel(name)`. El catálogo en vivo `/inox-ui` los lista automáticamente.

---

## Tokens (`tokens.scss`)

Todos con prefijo `--ix-`. Inox UI **no asigna valores cromáticos** — la
estructura de color existe vacía y cada proyecto consumidor la llena en su tema.

- **Espaciado** — escala 4 px: `--ix-sp-1` … `--ix-sp-12`.
- **Radios** — `--ix-r-xs/sm/md/lg/xl/full` (+ alias `--ix-radius-*`).
- **Transiciones** — `--ix-t-fast/normal/slow`, `--ix-ease`.
- **Tipografía (roles)** — `--ix-font-wordmark/brand/ui/mono` (+ `ubuntu`, `ubuntu-mono`).
- **Tipografía (escala)** — `--ix-font-size-xs` … `--ix-font-size-4xl`, en `rem`
  (base `1rem = 13px` vía `html { font-size: 81.25% }`; escala con el zoom — WCAG 1.4.4).
- **Layout** — `--ix-sidebar-w`, `--ix-sidebar-w-col`, `--ix-topbar-h`,
  `--ix-container-xl`, `--ix-page-padding`.
- **Z-index** — `--ix-z-base/raised/overlay/modal/toast/topbar`.
- **Color (estructura sin valores)** — `--ix-color-primary/hover/text/subtle`,
  `--ix-color-accent/*`, `--ix-color-secondary/*`, semánticos
  `success/danger/warning/info` (con `-bg`/`-border`), superficies
  `--ix-color-bg/surface/surface-alt`, texto `--ix-color-text/muted/disabled`,
  bordes `--ix-color-border/border-focus`, sombras `--ix-shadow-sm/md/lg`.

Ver `style/tokens.scss` para el detalle completo.

---

## Sobreescribir el tema

`tokens.scss` declara la estructura sin color. Cada proyecto crea un archivo de
tema que redefine los `--ix-color-*` para su identidad, aplicado por
`[data-theme]`:

```scss
[data-theme="dark"] {
  --ix-color-primary: #f97316;   // óxido (Shijima)
  --ix-color-accent:  #38bdf8;   // cian metálico
  // ...
}
```

Solo redefinir tokens `--ix-*`. Los tokens exclusivos del proyecto usan prefijo
propio (Shijima: `--sh-*`).

---

## Contribuir

### Un componente nuevo

1. **CSS** — `style/components/_nombre.scss` con clases `ix-nombre-*`, sin valores
   hardcodeados (siempre tokens `--ix-*`).
2. **Agregador** — `@forward 'components/nombre'` en `style/components.scss`.
3. **Svelte** — `src/lib/components/<categoría>/IxNombre.svelte` con runes.
4. **Tipos** — si necesita un enum de variantes, agregarlo a `src/lib/types.ts`.
5. **Export** — `export { default as IxNombre } from '...'` en `src/lib/index.ts`.
6. **Catálogo** — demo y código de ejemplo en `web/src/routes/inox-ui/+page.svelte`.
7. **CHANGELOG** — registrar el cambio en `CHANGELOG.md` (sección `[Unreleased]`).

### Un ícono

1. Copiar los `<path>` del SVG de Lucide al objeto `ICONS` en `src/lib/icons.ts`,
   con su etiqueta accesible en español.
2. El catálogo `/inox-ui` lo muestra automáticamente (itera `ICON_NAMES`).
3. Registrar en `CHANGELOG.md`.

---

## Accesibilidad (WCAG AA mínimo)

- `focus-visible` en todo interactivo; sin `outline: none` sin reemplazo.
- Escala tipográfica en `rem` — respeta zoom y preferencias del SO (WCAG 1.4.4).
- `min-height: 44px` en `.ix-btn` (WCAG 2.5.5 — touch target).
- `.ix-sr-only` para contenido exclusivo de lectores de pantalla.
- `IxToggle` usa `<input type="checkbox" role="switch">` nativo; estados vía
  `:has()`, sin JS.
- Imágenes decorativas: `aria-hidden="true"` o `alt=""`.

---

## Regla de universalidad

La capa CSS **no debe asumir nada del framework**: nada de sintaxis Svelte en
`.scss`, ni variables JS/TS en tokens. Si una clase necesita comportamiento JS
(modal, drawer, cola de toasts), el CSS define la presentación y el componente
Svelte gestiona el estado.

---

## Distribución y versioning

- **Fuente canónica** — repo Git propio en GitHub
  (`github.com/stahlsoft/inox-ui`). Quien cambia Inox UI sube el commit a
  `main` ahí; cada consumidor decide cuándo traerlo.
- **Consumo** — dependencia Git fijada (tag o commit), no por path ni
  workspace local. Ejemplo (`package.json` del consumidor):
  ```json
  "@stahl/inox-ui": "git+ssh://git@github.com/stahlsoft/inox-ui.git#<sha>"
  ```
  La versión del `package.json` es **informativa**: los consumidores pinean
  por commit SHA, así que describe el estado de la librería, no controla la
  resolución.
- **Versionado** — Inox UI versiona de forma independiente de los productos
  que la consumen. Durante la etapa de bases, `0.1.x` incremental simple; la
  política se formaliza cuando un segundo producto la consuma en producción.
- **Futuro** — eventual publicación en un registro npm, si Stahl decide
  abrirlo. Decisión de negocio, sin fecha.
