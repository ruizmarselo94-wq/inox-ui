<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    class?: string;
    children: Snippet;
  }

  let { class: extraClass = '', children }: Props = $props();

  const cls = $derived(['ix-card', extraClass].filter(Boolean).join(' '));
</script>

<div class={cls}>
  {@render children()}
</div>
