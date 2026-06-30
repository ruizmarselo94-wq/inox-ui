<script lang="ts">
  interface Props {
    checked?: boolean;
    disabled?: boolean;
    id?: string;
    name?: string;
    class?: string;
    onchange?: (checked: boolean) => void;
  }

  let {
    checked = $bindable(false),
    disabled = false,
    id,
    name,
    class: extraClass = '',
    onchange,
  }: Props = $props();

  const toggleId = $derived(id ?? `ix-toggle-${Math.random().toString(36).slice(2, 7)}`);

  function handleChange(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    checked = target.checked;
    onchange?.(checked);
  }
</script>

<span class={['ix-toggle', extraClass].filter(Boolean).join(' ')}>
  <input
    class="ix-toggle__input"
    type="checkbox"
    role="switch"
    id={toggleId}
    {name}
    {disabled}
    bind:checked
    onchange={handleChange}
    aria-checked={checked}
  />
  <span class="ix-toggle__track" aria-hidden="true">
    <span class="ix-toggle__thumb"></span>
  </span>
</span>
