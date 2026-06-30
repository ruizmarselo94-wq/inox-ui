<script lang="ts">
  import IxToggle from './IxToggle.svelte';

  interface Props {
    label: string;
    description?: string;
    checked?: boolean;
    disabled?: boolean;
    id?: string;
    name?: string;
    class?: string;
    onchange?: (checked: boolean) => void;
  }

  let {
    label,
    description,
    checked = $bindable(false),
    disabled = false,
    id,
    name,
    class: extraClass = '',
    onchange,
  }: Props = $props();

  const rowId = $derived(id ?? `ix-toggle-row-${Math.random().toString(36).slice(2, 7)}`);
</script>

<div class={['ix-toggle-row', extraClass].filter(Boolean).join(' ')}>
  <label class="ix-toggle-row__label" for={rowId}>
    <span class="ix-toggle-row__text">
      <span class="ix-toggle-row__title">{label}</span>
      {#if description}
        <span class="ix-toggle-row__desc">{description}</span>
      {/if}
    </span>
    <IxToggle id={rowId} {name} {disabled} bind:checked {onchange} />
  </label>
</div>
