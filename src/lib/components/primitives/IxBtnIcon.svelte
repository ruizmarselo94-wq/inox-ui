<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    danger?: boolean;
    disabled?: boolean;
    title?: string;
    class?: string;
    onclick?: (e: MouseEvent) => void;
    children: Snippet;
  }

  let {
    danger = false,
    disabled = false,
    title,
    class: extraClass = '',
    onclick,
    children,
  }: Props = $props();

  const cls = $derived(
    ['ix-btn-icon', danger ? 'ix-btn-icon--danger' : '', extraClass].filter(Boolean).join(' '),
  );
</script>

<button class={cls} type="button" {disabled} {title} {onclick}>
  {@render children()}
</button>
