<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { BtnVariant, BtnSize } from '../../types.js';

  interface Props {
    variant?: BtnVariant;
    size?: BtnSize;
    full?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
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

<button class={cls} {type} {disabled} {onclick}>
  {@render children()}
</button>
