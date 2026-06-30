<script lang="ts">
  interface Props {
    size?: number;
    class?: string;
    label?: string;
  }

  let { size = 20, class: extraClass = '', label = 'Cargando…' }: Props = $props();

  const cls = $derived(['ix-spinner', extraClass].filter(Boolean).join(' '));
</script>

<span class={cls} role="status" aria-label={label} style="--ix-spinner-size: {size}px">
  <span class="ix-spinner__ring" aria-hidden="true"></span>
  <span class="ix-sr-only">{label}</span>
</span>
