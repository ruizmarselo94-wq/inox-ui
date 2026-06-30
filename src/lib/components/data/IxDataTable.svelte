<script lang="ts" generics="T extends Record<string, unknown>">
  import type { Snippet } from 'svelte';
  import IxSpinner from '../primitives/IxSpinner.svelte';

  interface Column {
    header: string;
    key: keyof T & string;
    class?: string;
    cell?: Snippet<[T]>;
    render?: (row: T) => string;
  }

  interface Props {
    data: T[];
    columns: Column[];
    loading?: boolean;
    mensajeVacio?: string;
    class?: string;
    rowKey?: (row: T) => string | number;
  }

  let {
    data,
    columns,
    loading = false,
    mensajeVacio = 'Sin registros',
    class: extraClass = '',
    rowKey,
  }: Props = $props();

  const tablaCls = $derived(['ix-table-wrap', extraClass].filter(Boolean).join(' '));
</script>

<div class={tablaCls}>
  {#if loading}
    <div class="ix-table-loading">
      <IxSpinner size={24} />
    </div>
  {:else}
    <table class="ix-table">
      <thead>
        <tr>
          {#each columns as col (col.key)}
            <th class={col.class}>{col.header}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#if data.length === 0}
          <tr>
            <td colspan={columns.length} class="ix-table__empty">{mensajeVacio}</td>
          </tr>
        {:else}
          {#each data as row, i (rowKey ? rowKey(row) : i)}
            <tr>
              {#each columns as col (col.key)}
                <td class={col.class}>
                  {#if col.cell}
                    {@render col.cell(row)}
                  {:else if col.render}
                    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                    {@html col.render(row)}
                  {:else}
                    {String(row[col.key] ?? '')}
                  {/if}
                </td>
              {/each}
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  {/if}
</div>
