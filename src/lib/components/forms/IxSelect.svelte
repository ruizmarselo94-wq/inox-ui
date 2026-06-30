<script lang="ts">
  interface OpcionSelect {
    value: string;
    label: string;
    disabled?: boolean;
  }

  interface Props {
    label?: string;
    opciones: OpcionSelect[];
    value?: string;
    disabled?: boolean;
    required?: boolean;
    error?: string;
    hint?: string;
    placeholder?: string;
    id?: string;
    name?: string;
    class?: string;
    onchange?: (e: Event & { currentTarget: HTMLSelectElement }) => void;
  }

  let {
    label,
    opciones,
    value = $bindable(''),
    disabled = false,
    required = false,
    error,
    hint,
    placeholder,
    id,
    name,
    class: extraClass = '',
    onchange,
  }: Props = $props();

  const selectId = $derived(id ?? `ix-select-${Math.random().toString(36).slice(2, 7)}`);
  const wrapperCls = $derived(
    ['ix-field', error ? 'ix-field--error' : '', extraClass].filter(Boolean).join(' '),
  );
</script>

<div class={wrapperCls}>
  {#if label}
    <label class="ix-label" for={selectId}>
      {label}{#if required}<span class="ix-req" aria-hidden="true">*</span>{/if}
    </label>
  {/if}
  <div class="ix-select-wrapper">
    <select
      class="ix-select"
      id={selectId}
      {name}
      {disabled}
      {required}
      bind:value
      {onchange}
      aria-invalid={error ? 'true' : undefined}
    >
      {#if placeholder}
        <option value="" disabled>{placeholder}</option>
      {/if}
      {#each opciones as op (op.value)}
        <option value={op.value} disabled={op.disabled}>{op.label}</option>
      {/each}
    </select>
  </div>
  {#if error}
    <span class="ix-field__error" role="alert">{error}</span>
  {:else if hint}
    <span class="ix-field__hint">{hint}</span>
  {/if}
</div>
