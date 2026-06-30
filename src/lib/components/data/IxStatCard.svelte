<script lang="ts">
  type AcentoColor = 'primary' | 'accent' | 'neutral';

  interface Props {
    label: string;
    valor: string;
    unidad?: string;
    subtexto?: string;
    acento?: AcentoColor;
  }

  let { label, valor, unidad, subtexto, acento = 'primary' }: Props = $props();

  const acentoStyle = $derived({
    primary:  'var(--ix-color-primary)',
    accent:   'var(--ix-color-accent)',
    neutral:  'var(--ix-color-border)',
  }[acento]);
</script>

<div class="ix-stat-card">
  <div class="ix-stat-card__accent" style="background: {acentoStyle}"></div>
  <div class="ix-stat-card__label">{label}</div>
  <div class="ix-stat-card__value">
    {valor}{#if unidad}<span class="ix-stat-card__unit">{unidad}</span>{/if}
  </div>
  {#if subtexto}
    <div class="ix-stat-card__sub">{subtexto}</div>
  {/if}
</div>
