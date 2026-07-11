<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    /** Abre/cierra el modal. Bindable: `bind:open`. */
    open?: boolean;
    /** Título del header. Si se omite, no se renderiza el header. */
    title?: string;
    /** Ancho del modal. */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** Se llama al cerrar (Esc, backdrop, botón o `.close()`). */
    onclose?: () => void;
    class?: string;
    children: Snippet;
    /** Contenido del footer (acciones). Si se omite, no se renderiza. */
    footer?: Snippet;
  }

  let {
    open = $bindable(false),
    title,
    size = 'md',
    onclose,
    class: extraClass = '',
    children,
    footer,
  }: Props = $props();

  let dialog = $state<HTMLDialogElement>();

  // <dialog> nativo: showModal() da top-layer, focus-trap, Esc y ::backdrop
  // gratis. Sincronizamos el elemento con el prop `open`.
  $effect(() => {
    const el = dialog;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  });

  // El evento `close` del <dialog> cubre Esc y .close(). Sincroniza el prop.
  function handleClose() {
    open = false;
    onclose?.();
  }

  // Cerrar al clic en el backdrop: un clic sobre ::backdrop tiene el propio
  // <dialog> como target (el contenido interno no).
  function handleClick(e: MouseEvent) {
    if (e.target === dialog) open = false;
  }

  const cls = $derived(
    ['ix-modal', size !== 'md' ? `ix-modal--${size}` : '', extraClass]
      .filter(Boolean)
      .join(' '),
  );
</script>

<dialog bind:this={dialog} class={cls} onclose={handleClose} onclick={handleClick}>
  {#if title}
    <div class="ix-modal__header">
      <h2 class="ix-modal__title">{title}</h2>
      <button
        type="button"
        class="ix-modal__close"
        aria-label="Cerrar"
        onclick={() => (open = false)}
      >×</button>
    </div>
  {/if}

  <div class="ix-modal__body">
    {@render children()}
  </div>

  {#if footer}
    <div class="ix-modal__footer">
      {@render footer()}
    </div>
  {/if}
</dialog>
