<script lang="ts">
  interface Bar {
    label: string;
    value: number;
  }

  interface Props {
    bars:         Bar[];
    height?:      number;
    formatValue?: (value: number) => string;
    emptyText?:   string;
  }

  let {
    bars,
    height      = 140,
    formatValue = (v) => String(v),
    emptyText   = 'Sin datos',
  }: Props = $props();

  const maxValue = $derived(bars.length ? Math.max(...bars.map(b => b.value)) : 0);

  function pct(value: number): string {
    if (maxValue === 0) return '0';
    return ((value / maxValue) * 100).toFixed(1);
  }
</script>

{#if bars.length === 0}
  <div class="ix-bar-chart__empty">{emptyText}</div>
{:else}
  <div class="ix-bar-chart" style="--ix-bar-chart-height: {height}px" role="img" aria-label="Gráfico de barras">
    {#each bars as bar}
      <div class="ix-bar-chart__col">
        <div
          class="ix-bar-chart__bar"
          style="height: {pct(bar.value)}%"
          title={formatValue(bar.value)}
        ></div>
        <span class="ix-bar-chart__label">{bar.label}</span>
      </div>
    {/each}
  </div>
{/if}

<style>
  .ix-bar-chart {
    display: flex;
    align-items: flex-end;
    gap: var(--ix-sp-2);
    height: var(--ix-bar-chart-height, 140px);
    padding-bottom: var(--ix-sp-6);
  }

  .ix-bar-chart__col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: var(--ix-sp-1);
    height: 100%;
  }

  .ix-bar-chart__bar {
    width: 100%;
    background: var(--ix-color-primary);
    border-radius: var(--ix-r-sm) var(--ix-r-sm) 0 0;
    min-height: 4px;
    opacity: 0.85;
    transition: opacity 0.15s;
  }

  .ix-bar-chart__bar:hover {
    opacity: 1;
  }

  .ix-bar-chart__label {
    font-size: 11px;
    color: var(--ix-color-text-muted);
    font-family: var(--ix-font-mono);
    white-space: nowrap;
  }

  .ix-bar-chart__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 120px;
    font-size: var(--ix-font-size-sm);
    color: var(--ix-color-text-muted);
  }
</style>
