<script lang="ts">
  import type { ToastContext } from '../toast.svelte.js';
  import IxIcon from './primitives/IxIcon.svelte';

  interface Props {
    toast: ToastContext;
  }

  let { toast }: Props = $props();

  const kindCls: Record<string, string> = {
    ok:   'ix-toast--ok',
    err:  'ix-toast--err',
    warn: 'ix-toast--warn',
    info: 'ix-toast--info',
  };
</script>

<div class="ix-toast-container" aria-live="polite" aria-atomic="false">
  {#each toast.toasts as entry (entry.id)}
    <div class="ix-toast {kindCls[entry.kind] ?? ''}" role="alert">
      <span style="flex: 1">{entry.message}</span>
      <button
        class="ix-btn-icon"
        type="button"
        style="width: 20px; height: 20px; border: none; flex-shrink: 0"
        onclick={() => toast.dismiss(entry.id)}
        aria-label="Cerrar"
      >
        <IxIcon name="x" size={14} ariaHidden />
      </button>
    </div>
  {/each}
</div>
