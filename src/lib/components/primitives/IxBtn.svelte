<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { BtnVariant, BtnSize } from '../../types.js';

  interface Props {
    variant?: BtnVariant;
    size?: BtnSize;
    full?: boolean;
    disabled?: boolean;
    /** Solo aplica al `<button>`; con `href` no tiene sentido. */
    type?: 'button' | 'submit' | 'reset';
    /**
     * Destino. Presente → el componente renderiza un `<a>` en vez de un
     * `<button>`.
     *
     * No es azúcar: **el elemento tiene que seguir a la semántica, no al
     * aspecto**. Un control que lleva a otra URL es un enlace, y serlo de
     * verdad es lo que le da gratis abrir en pestaña nueva (mantener
     * presionado, clic derecho, clic del medio, Ctrl+clic), copiar la
     * dirección, la vista previa del destino y —lo que más pesa— que un lector
     * de pantalla lo anuncie como enlace y lo liste entre los enlaces de la
     * página. Un `<button>` con un `goto()` adentro pierde todo eso sin avisar,
     * y se ve idéntico: por eso es un error fácil de cometer y difícil de ver.
     *
     * Al revés también importa: lo que ejecuta una acción (enviar, aceptar,
     * rendirse) es un `<button>` y no debe recibir `href`.
     */
    href?: string;
    class?: string;
    onclick?: (e: MouseEvent) => void;
    children: Snippet;
  }

  let {
    variant = 'primary',
    size = 'md',
    full = false,
    disabled = false,
    type = 'button',
    href,
    class: extraClass = '',
    onclick,
    children,
  }: Props = $props();

  const cls = $derived(
    ['ix-btn', `ix-btn--${variant}`, `ix-btn--${size}`, full ? 'ix-btn--full' : '', extraClass]
      .filter(Boolean)
      .join(' '),
  );
</script>

{#if href && !disabled}
  <a class={cls} {href} {onclick}>
    {@render children()}
  </a>
{:else if href}
  <!-- Enlace deshabilitado: se renderiza inerte en vez de como `<a>` sin
       `href`, mismo criterio que IxBtnOauth. Un `<a>` sin destino sigue
       siendo enfocable y anunciable como enlace, y sería un enlace que no
       lleva a ningún lado. `aria-disabled` lo dice, `tabindex="-1"` lo saca
       del recorrido del teclado. -->
  <span class={cls} aria-disabled="true" tabindex="-1">
    {@render children()}
  </span>
{:else}
  <button class={cls} {type} {disabled} {onclick}>
    {@render children()}
  </button>
{/if}
