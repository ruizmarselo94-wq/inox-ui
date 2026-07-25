<script lang="ts">
  import type { AvatarSize } from '../../types.js';

  interface Props {
    /** Nombre del que se derivan la inicial y el texto accesible. Requerido. */
    name:   string;
    /** URL de la foto. Si carga bien se muestra; si falla, cae a la inicial. */
    src?:   string;
    /** Tamaño del círculo. Compatible con `.ix-avatar--sm/md/lg`. */
    size?:  AvatarSize;
    /** Texto alternativo. Por defecto el `name`; pasar `""` para decorativo. */
    alt?:   string;
    class?: string;
  }

  let { name, src, size = 'md', alt, class: extraClass = '' }: Props = $props();

  // Si la foto falla al cargar (URL muerta, el usuario la borró en el proveedor)
  // se cae a la inicial. Sin esto, un `src` roto dejaría el ícono de imagen rota.
  let failed = $state(false);
  // Nueva URL → limpiar el estado de error y reintentar cargarla.
  $effect(() => { void src; failed = false; });

  const showImg = $derived(!!src && !failed);
  const initial = $derived((name.trim().charAt(0) || '?').toUpperCase());
  // `alt` undefined → derivar del nombre; `alt=""` → decorativo (sin etiqueta).
  const label   = $derived(alt ?? name);
  const cls     = $derived(
    ['ix-avatar', `ix-avatar--${size}`, extraClass].filter(Boolean).join(' '),
  );
</script>

{#if showImg}
  <span class={cls}>
    <img
      class="ix-avatar__img"
      src={src}
      alt={label}
      loading="lazy"
      onerror={() => (failed = true)}
    />
  </span>
{:else}
  <span
    class={cls}
    role={label ? 'img' : undefined}
    aria-label={label || undefined}
    aria-hidden={label ? undefined : 'true'}
  >{initial}</span>
{/if}
