<script lang="ts">
  import { getIconPaths, getIconLabel } from '../../icons.js';

  interface Props {
    name: string;
    size?: number;
    ariaHidden?: boolean;
    ariaLabel?: string;
    class?: string;
  }

  let {
    name,
    size = 16,
    ariaHidden = false,
    ariaLabel,
    class: extraClass = '',
  }: Props = $props();

  const cls = $derived(['ix-icon', extraClass].filter(Boolean).join(' '));
  const paths = $derived(getIconPaths(name));
  const label = $derived(ariaLabel ?? getIconLabel(name));
</script>

{#if ariaHidden}
  <svg
    class={cls}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html paths}
  </svg>
{:else}
  <svg
    class={cls}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    role="img"
    aria-label={label}
    focusable="false"
  >
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html paths}
  </svg>
{/if}
