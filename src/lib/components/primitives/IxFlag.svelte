<script lang="ts">
  import { getFlagData, nextFlagId } from '../../flags.js';

  interface Props {
    country: string;
    width?:  number;
    class?:  string;
  }

  let { country, width = 22, class: extraClass = '' }: Props = $props();

  // id único por instancia — evita choques de clipPath si hay varias.
  const uid = nextFlagId();

  const flag   = $derived(getFlagData(country));
  const height = $derived(flag ? Math.round((width * flag.height) / flag.width) : 0);
  const inner  = $derived(flag ? flag.inner.replaceAll('__ID__', uid) : '');
  const cls    = $derived(['ix-flag', extraClass].filter(Boolean).join(' '));
</script>

{#if flag}
  <svg
    class={cls}
    viewBox={flag.viewBox}
    {width}
    {height}
    role="img"
    aria-label={flag.label}
  >
    {@html inner}
  </svg>
{/if}
