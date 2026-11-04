<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { TabItem } from '../../types.js';

  // Pestañas con el patrón de WAI-ARIA: la lista se recorre con las flechas,
  // Inicio y Fin, y solo la pestaña elegida entra en el orden del Tab —el
  // resto se alcanza con las flechas—. El panel es uno: lo que va adentro lo
  // decide el consumidor según `value`.
  interface Props {
    tabs: TabItem[];
    value?: string;
    /** Para quien lee con lector de pantalla: qué se elige con las pestañas. */
    label: string;
    class?: string;
    onchange?: (key: string) => void;
    children: Snippet;
  }

  let {
    tabs,
    value = $bindable(tabs[0]?.key ?? ''),
    label,
    class: extraClass = '',
    onchange,
    children,
  }: Props = $props();

  const base = `ix-tabs-${Math.random().toString(36).slice(2, 7)}`;
  let list = $state<HTMLElement | null>(null);

  function select(key: string) {
    if (key === value) return;
    value = key;
    onchange?.(key);
  }

  function onKey(e: KeyboardEvent) {
    const at = tabs.findIndex((t) => t.key === value);
    let next = at;
    if (e.key === 'ArrowRight') next = (at + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') next = (at - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    else return;
    e.preventDefault();
    select(tabs[next].key);
    list?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
  }
</script>

<div class={['ix-tabs', extraClass].filter(Boolean).join(' ')}>
  <div class="ix-tabs__list" role="tablist" aria-label={label} bind:this={list} tabindex="-1" onkeydown={onKey}>
    {#each tabs as tab (tab.key)}
      <button
        class="ix-tabs__tab"
        type="button"
        role="tab"
        id="{base}-{tab.key}"
        aria-selected={tab.key === value}
        aria-controls="{base}-panel"
        tabindex={tab.key === value ? 0 : -1}
        onclick={() => select(tab.key)}
      >
        {tab.label}
      </button>
    {/each}
  </div>
  <div class="ix-tabs__panel" role="tabpanel" id="{base}-panel" aria-labelledby="{base}-{value}" tabindex="0">
    {@render children()}
  </div>
</div>
