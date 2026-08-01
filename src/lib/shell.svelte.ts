import { setContext, getContext } from 'svelte';
import type { Theme, LayoutMode } from './types.js';

const SHELL_KEY = Symbol('ix-shell');

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // silent in SSR or restricted environments
  }
}

function createShellContext(initial: {
  theme?:     Theme;
  layout?:    LayoutMode;
  collapsed?: boolean;
}) {
  let theme      = $state<Theme>(initial.theme    ?? 'dark');
  let layout     = $state<LayoutMode>(initial.layout  ?? 'sidebar');
  let collapsed  = $state(initial.collapsed ?? false);
  let mobileOpen = $state(false);

  function applyToDOM(t: Theme) {
    document.documentElement.dataset['theme'] = t;
  }

  return {
    get theme()      { return theme; },
    get layout()     { return layout; },
    get collapsed()  { return collapsed; },
    get mobileOpen() { return mobileOpen; },

    setTheme(v: Theme) {
      theme = v;
      writeStorage('theme', v);
      applyToDOM(v);
    },
    setLayout(v: LayoutMode) {
      layout = v;
      writeStorage('layout_mode', v);
    },
    toggleCollapsed() {
      collapsed = !collapsed;
      writeStorage('sidebar_collapsed', collapsed ? '1' : '0');
    },
    toggleTheme() {
      this.setTheme(theme === 'dark' ? 'light' : 'dark');
    },
    toggleMobile() {
      mobileOpen = !mobileOpen;
    },
    closeMobile() {
      mobileOpen = false;
    },

    loadFromStorage() {
      const t = readStorage('theme');
      if (t === 'dark' || t === 'light') theme = t;
      const lm = readStorage('layout_mode');
      if (lm === 'topbar' || lm === 'sidebar') layout = lm as LayoutMode;
      const col = readStorage('sidebar_collapsed');
      if (col !== null) collapsed = col === '1';
      applyToDOM(theme);
    },
  };
}

export type ShellContext = ReturnType<typeof createShellContext>;

export function provideShell(initial: {
  theme?:     Theme;
  layout?:    LayoutMode;
  collapsed?: boolean;
}): ShellContext {
  const ctx = createShellContext(initial);
  setContext(SHELL_KEY, ctx);
  return ctx;
}

export function useShell(): ShellContext {
  const ctx = getContext<ShellContext>(SHELL_KEY);
  if (!ctx) throw new Error('useShell: wrap your app in <IxShell>');
  return ctx;
}
