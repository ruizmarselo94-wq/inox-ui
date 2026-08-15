<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    /**
     * `sm` (24px) para cuando el botón acompaña a otra cosa y no puede
     * competir con ella; `md` (28px, por defecto) para barras y toolbars.
     * El blanco táctil no sale de acá: el consumidor lo agranda con un
     * `::after` desbordado, que no ocupa lugar en el layout.
     */
    size?: 'sm' | 'md';
    danger?: boolean;
    disabled?: boolean;
    /** Tooltip en escritorio. Sirve de nombre accesible SOLO si no hay
     *  `ariaLabel`; preferir `ariaLabel`, que es el mecanismo explícito. */
    title?: string;
    /** Nombre accesible. Obligatorio en la práctica: este botón no tiene
     *  texto visible, así que sin esto se anuncia como "botón" y nada más. */
    ariaLabel?: string;
    class?: string;
    onclick?: (e: MouseEvent) => void;
    children: Snippet;
  }

  let {
    size = 'md',
    danger = false,
    disabled = false,
    title,
    ariaLabel,
    class: extraClass = '',
    onclick,
    children,
  }: Props = $props();

  const cls = $derived(
    ['ix-btn-icon', `ix-btn-icon--${size}`, danger ? 'ix-btn-icon--danger' : '', extraClass]
      .filter(Boolean).join(' '),
  );
</script>

<button class={cls} type="button" {disabled} {title} aria-label={ariaLabel} {onclick}>
  {@render children()}
</button>
