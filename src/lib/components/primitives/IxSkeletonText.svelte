<script lang="ts">
  import IxSkeleton from './IxSkeleton.svelte';

  /**
   * Líneas de texto que cargan: el cuerpo de una tarjeta mientras llegan sus
   * datos. La última más corta, como un párrafo real. Anuncia una sola vez
   * que está cargando.
   */
  interface Props {
    lines?: number;
    label?: string;
  }
  let { lines = 3, label = 'Cargando…' }: Props = $props();
</script>

<div class="ix-skeleton-text" aria-busy="true">
  <span class="ix-sr-only" role="status">{label}</span>
  {#each Array.from({ length: lines }, (_, i) => i) as i (i)}
    <IxSkeleton width={i === lines - 1 && lines > 1 ? '60%' : '100%'} />
  {/each}
</div>
