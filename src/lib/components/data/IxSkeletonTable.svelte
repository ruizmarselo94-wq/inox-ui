<script lang="ts">
  import IxSkeleton from '../primitives/IxSkeleton.svelte';

  /**
   * Una tabla que carga: los encabezados reales desde el principio y filas
   * esqueleto del mismo alto que las verdaderas. Cuando llegan los datos, la
   * tabla real ocupa el mismo lugar y nada se corre. `lines` es 2 cuando la
   * primera columna de la tabla real lleva nombre y una línea debajo.
   */
  interface Props {
    headers: string[];
    rows?:   number;
    lines?:  1 | 2;
    label?:  string;
  }
  let { headers, rows = 5, lines = 1, label = 'Cargando…' }: Props = $props();

  // Anchos que varían de fila a fila, siempre los mismos: una tabla esqueleto
  // con todas las barras iguales se lee como un bloque, no como filas.
  const WIDTHS = ['72%', '48%', '60%', '38%', '55%', '66%'];
  const width = (row: number, col: number) => WIDTHS[(row * 2 + col) % WIDTHS.length];
</script>

<div class="ix-table-wrap" aria-busy="true">
  <span class="ix-sr-only" role="status">{label}</span>
  <table class="ix-table ix-skeleton-table">
    <thead>
      <tr>
        {#each headers as header, j (j)}<th>{header}</th>{/each}
      </tr>
    </thead>
    <tbody>
      {#each Array.from({ length: rows }, (_, i) => i) as i (i)}
        <tr>
          {#each headers as header, j (j)}
            <td>
              {#if header !== '' || j === 0}
                <span class={lines === 2 && j === 0 ? 'ix-skeleton-table__cell ix-skeleton-table__cell--two' : 'ix-skeleton-table__cell'}>
                  <IxSkeleton width={width(i, j)} />
                  {#if lines === 2 && j === 0}<IxSkeleton width="40%" height="0.75em" />{/if}
                </span>
              {/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
