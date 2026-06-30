<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { BadgeVariant } from '../../types.js';

  interface Props {
    variant?: BadgeVariant;
    class?: string;
    children: Snippet;
  }

  let { variant = 'neutral', class: extraClass = '', children }: Props = $props();

  const cls = $derived(
    ['ix-badge', `ix-badge--${variant}`, extraClass].filter(Boolean).join(' '),
  );
</script>

<span class={cls}>
  {@render children()}
</span>
