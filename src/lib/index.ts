// ── Tipos ─────────────────────────────────────────────────────────────────────
export type {
  Theme, LayoutMode, BadgeVariant, BtnVariant, BtnSize, AvatarSize,
  ToastKind, NavItem, NavSection, UserProfile, DataColumn, AlertItem, AlertVariant,
} from './types.js';

// ── Íconos ────────────────────────────────────────────────────────────────────
export { getIconPaths, getIconLabel, ICON_NAMES } from './icons.js';

// ── Toast ─────────────────────────────────────────────────────────────────────
export { useToast, provideToast } from './toast.svelte.js';
export type { ToastContext } from './toast.svelte.js';

// ── Shell ─────────────────────────────────────────────────────────────────────
export { useShell, provideShell } from './shell.svelte.js';
export type { ShellContext } from './shell.svelte.js';

// ── Primitivos ────────────────────────────────────────────────────────────────
export { default as IxAvatar }  from './components/primitives/IxAvatar.svelte';
export { default as IxBadge }   from './components/primitives/IxBadge.svelte';
export { default as IxFlag }         from './components/primitives/IxFlag.svelte';
export { default as IxThemePicker }  from './components/primitives/IxThemePicker.svelte';
export { default as IxBtn }          from './components/primitives/IxBtn.svelte';
export { default as IxBtnIcon } from './components/primitives/IxBtnIcon.svelte';
export { default as IxBtnOauth } from './components/primitives/IxBtnOauth.svelte';
export { default as IxCard }    from './components/primitives/IxCard.svelte';
export { default as IxIcon }    from './components/primitives/IxIcon.svelte';
export { default as IxSpinner }           from './components/primitives/IxSpinner.svelte';
export { default as IxModal }             from './components/primitives/IxModal.svelte';
export { default as IxNotificationBell }  from './components/primitives/IxNotificationBell.svelte';

// ── Formularios ───────────────────────────────────────────────────────────────
export { default as IxInput }     from './components/forms/IxInput.svelte';
export { default as IxInputTel }  from './components/forms/IxInputTel.svelte';
export { default as IxSelect }    from './components/forms/IxSelect.svelte';
export { default as IxToggle }    from './components/forms/IxToggle.svelte';
export { default as IxToggleRow } from './components/forms/IxToggleRow.svelte';

// ── Layout ────────────────────────────────────────────────────────────────────
export { default as IxShell }   from './components/layout/IxShell.svelte';
export { default as IxSidebar } from './components/layout/IxSidebar.svelte';
export { default as IxTopbar }  from './components/layout/IxTopbar.svelte';

// ── Datos ─────────────────────────────────────────────────────────────────────
export { default as IxBarChart }  from './components/data/IxBarChart.svelte';
export { default as IxDataTable } from './components/data/IxDataTable.svelte';
export { default as IxStatCard }  from './components/data/IxStatCard.svelte';

// ── Feedback ──────────────────────────────────────────────────────────────────
export { default as IxToast }         from './components/IxToast.svelte';
export { default as IxToastProvider } from './components/IxToastProvider.svelte';
