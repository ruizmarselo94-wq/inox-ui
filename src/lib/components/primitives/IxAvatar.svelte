<script lang="ts">
  import type { AvatarSize } from '../../types.js';

  interface Props {
    /** Nombre del que se derivan la inicial y el texto accesible. Requerido. */
    name:   string;
    /** URL de la foto. Si carga bien se muestra; si falla, cae a la inicial.
     *  Acepta `null` además de `undefined`: los DTOs de los consumidores suelen
     *  exponer el avatar como `string | null`, y así no necesitan `?? undefined`. */
    src?:   string | null;
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
    <!--
      `referrerpolicy="no-referrer"` no es una micro-optimización: es privacidad.
      Estas fotos casi siempre son URLs de un proveedor externo (Google,
      GitHub) que el navegador del visitante trae en directo. Sin esta línea,
      cada carga le manda a ese proveedor la URL COMPLETA de la página donde
      apareció el avatar, además de la IP de quien mira. O sea que el proveedor
      va aprendiendo qué pantallas recorre cada persona dentro de la app, sin
      que nadie se lo haya pedido. Los CDN de avatares no exigen `Referer`, así
      que no cuesta nada.

      No hacen falta `width`/`height`: el `<span>` contenedor tiene tamaño fijo
      por CSS (`.ix-avatar--sm/md/lg`) y la imagen lo llena, así que la caja ya
      está reservada y no hay salto de layout al cargar.
    -->
    <img
      class="ix-avatar__img"
      src={src}
      alt={label}
      loading="lazy"
      decoding="async"
      referrerpolicy="no-referrer"
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
