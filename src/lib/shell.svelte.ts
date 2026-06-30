import { setContext, getContext } from 'svelte';
import type { Theme, LayoutMode, AccentColor } from './types.js';

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
  accent?:    AccentColor;
  layout?:    LayoutMode;
  collapsed?: boolean;
}) {
  let theme      = $state<Theme>(initial.theme    ?? 'dark');
  let accent     = $state<AccentColor>(initial.accent ?? 'rust');
  let layout     = $state<LayoutMode>(initial.layout  ?? 'sidebar');
  let collapsed  = $state(initial.collapsed ?? false);
  let mobileOpen = $state(false);

  function applyToDOM(t: Theme, a: AccentColor) {
    document.documentElement.dataset['theme'] = t;
    if (t === 'carbon' || t === 'stainless' || t === 'titanium') {
      delete document.documentElement.dataset['accent'];
    } else {
      document.documentElement.dataset['accent'] = a;
    }
  }

  return {
    get theme()      { return theme; },
    get accent()     { return accent; },
    get layout()     { return layout; },
    get collapsed()  { return collapsed; },
    get mobileOpen() { return mobileOpen; },

    setTheme(v: Theme) {
      theme = v;
      writeStorage('theme', v);
      applyToDOM(v, accent);
    },
    setAccent(v: AccentColor) {
      accent = v;
      writeStorage('accent', v);
      applyToDOM(theme, v);
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
      if (t === 'dark' || t === 'light' || t === 'carbon' || t === 'stainless' || t === 'titanium') theme = t;
      const a = readStorage('accent');
      if (a === 'rust' || a === 'steel') accent = a;
      const lm = readStorage('layout_mode');
      if (lm === 'topbar' || lm === 'sidebar') layout = lm as LayoutMode;
      const col = readStorage('sidebar_collapsed');
      if (col !== null) collapsed = col === '1';
      applyToDOM(theme, accent);
    },
  };
}

export type ShellContext = ReturnType<typeof createShellContext>;

export function provideShell(initial: {
  theme?:     Theme;
  accent?:    AccentColor;
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
