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
    /** Lo que lee un lector de pantalla antes de los valores. */
    ariaLabel?:   string;
  }

  let {
    bars,
    height      = 140,
    formatValue = (v) => String(v),
    emptyText   = 'Sin datos',
    ariaLabel   = 'Gráfico de barras',
  }: Props = $props();

  /** Lo que ocupa un rótulo con su aire, en px. Con menos lugar por barra, se
   *  muestra uno cada tanto. */
  const LABEL_SLOT = 32;
  /** Saltos que se leen solos: cada 2, 3, 4, 6 o 12. Con 24 horas, «cada 5»
   *  ponía las marcas en 0, 5, 10… y ninguna caía a las 12. */
  const STEPS = [1, 2, 3, 4, 6, 12];

  let width = $state(0);

  const maxValue = $derived(Math.max(0, ...bars.map((b) => b.value)));

  const labelStep = $derived.by(() => {
    if (width === 0) return bars.length;
    const raw = Math.ceil((bars.length * LABEL_SLOT) / width);
    return STEPS.find((s) => s >= raw) ?? raw;
  });

  /** Cero o menos no dibuja barra: una rayita mínima se leía como una venta
   *  chica. El eje marca dónde está el cero. */
  function pct(value: number): number {
    return maxValue > 0 && value > 0 ? (value / maxValue) * 100 : 0;
  }

  const summary = $derived(
    [ariaLabel, ...bars.filter((b) => b.value > 0).map((b) => `${b.label}: ${formatValue(b.value)}`)].join('. '),
  );
</script>

{#if bars.length === 0}
  <div class="ix-bar-chart__empty">{emptyText}</div>
{:else}
  <!-- Las barras y los rótulos van en dos filas con las mismas columnas: un
       rótulo dentro de la columna le imponía su ancho, y con muchas barras
       las últimas quedaban fuera de la tarjeta. -->
  <div class="ix-bar-chart" role="img" aria-label={summary} bind:clientWidth={width}>
    <div class="ix-bar-chart__plot" style="--ix-bar-chart-height: {height}px">
      {#each bars as bar, i (i)}
        <div class="ix-bar-chart__col" title="{bar.label}: {formatValue(bar.value)}">
          {#if pct(bar.value) > 0}
            <div class="ix-bar-chart__bar" style="height: {pct(bar.value).toFixed(1)}%"></div>
          {/if}
        </div>
      {/each}
    </div>
    <div class="ix-bar-chart__labels" aria-hidden="true">
      {#each bars as bar, i (i)}
        <span class="ix-bar-chart__label" class:ix-bar-chart__label--hidden={i % labelStep !== 0}>
          {bar.label}
        </span>
      {/each}
    </div>
  </div>
{/if}

<style>
  .ix-bar-chart {
    --ix-bar-chart-gap: clamp(1px, 1%, var(--ix-sp-2));
    display: flex;
    flex-direction: column;
    gap: var(--ix-sp-1);
  }

  .ix-bar-chart__plot,
  .ix-bar-chart__labels {
    display: flex;
    gap: var(--ix-bar-chart-gap);
  }

  .ix-bar-chart__plot {
    align-items: flex-end;
    height: var(--ix-bar-chart-height, 140px);
    border-bottom: 1px solid var(--ix-color-border);
  }

  .ix-bar-chart__col {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: flex-end;
    height: 100%;
  }

  .ix-bar-chart__bar {
    width: 100%;
    min-height: 2px;
    background: var(--ix-color-primary);
    border-radius: var(--ix-r-sm) var(--ix-r-sm) 0 0;
    opacity: 0.85;
    transition: opacity 0.15s;
  }

  .ix-bar-chart__col:hover .ix-bar-chart__bar {
    opacity: 1;
  }

  /* Centrado aunque no entre en su columna: con `justify-content`, lo que
     sobra se reparte a los dos lados y el rótulo queda bajo su barra. */
  .ix-bar-chart__label {
    flex: 1;
    min-width: 0;
    display: flex;
    justify-content: center;
    font-size: 11px;
    color: var(--ix-color-text-muted);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .ix-bar-chart__label--hidden {
    visibility: hidden;
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
