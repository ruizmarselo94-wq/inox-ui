import { setContext, getContext } from 'svelte';
import type { ToastKind } from './types.js';

const TOAST_KEY = Symbol('ix-toast');

interface ToastEntry {
  id: number;
  kind: ToastKind;
  message: string;
}

function createToastContext() {
  let toasts = $state<ToastEntry[]>([]);
  let nextId = $state(0);

  function push(kind: ToastKind, message: string, duracion = 4000) {
    const id = nextId++;
    toasts = [...toasts, { id, kind, message }];
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
    }, duracion);
  }

  return {
    get toasts() { return toasts; },
    ok:      (msg: string) => push('ok', msg),
    err:     (msg: string) => push('err', msg),
    warn:    (msg: string) => push('warn', msg),
    info:    (msg: string) => push('info', msg),
    dismiss: (id: number) => { toasts = toasts.filter((t) => t.id !== id); },
  };
}

export type ToastContext = ReturnType<typeof createToastContext>;

export function provideToast(): ToastContext {
  const ctx = createToastContext();
  setContext(TOAST_KEY, ctx);
  return ctx;
}

export function useToast(): ToastContext {
  const ctx = getContext<ToastContext>(TOAST_KEY);
  if (!ctx) throw new Error('useToast: envolvé tu app en <IxToastProvider>');
  return ctx;
}
