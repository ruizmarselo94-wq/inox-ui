<script lang="ts">
  type StatAccent = 'primary' | 'accent' | 'neutral';

  interface Props {
    label: string;
    value: string;
    unit?: string;
    subtext?: string;
    accent?: StatAccent;
  }

  let { label, value, unit, subtext, accent = 'primary' }: Props = $props();

  const accentStyle = $derived({
    primary:  'var(--ix-color-primary)',
    accent:   'var(--ix-color-accent)',
    neutral:  'var(--ix-color-border)',
  }[accent]);
</script>

<div class="ix-stat-card">
  <div class="ix-stat-card__accent" style="background: {accentStyle}"></div>
  <div class="ix-stat-card__label">{label}</div>
  <div class="ix-stat-card__value">
    {value}{#if unit}<span class="ix-stat-card__unit">{unit}</span>{/if}
  </div>
  {#if subtext}
    <div class="ix-stat-card__sub">{subtext}</div>
  {/if}
</div>
