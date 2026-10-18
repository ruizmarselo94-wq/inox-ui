<script lang="ts">
  import { page } from '$app/stores';
  import type { Snippet } from 'svelte';
  import type { NavSection, UserProfile } from '../../types.js';
  import { useShell } from '../../shell.svelte.js';
  import IxIcon from '../primitives/IxIcon.svelte';

  interface Props {
    nav: NavSection[];
    user?: UserProfile;
    logoSrc?: string;
    appName?: string;
    version?: string;
    onSignOut?: () => void;
    /** El pie del menú, si el consumidor quiere más que `appName version`. */
    footer?: Snippet;
  }

  let {
    nav,
    user,
    logoSrc,
    appName = 'App',
    version = 'v0.1',
    onSignOut,
    footer,
  }: Props = $props();

  const shell = useShell();

  const sidebarCls = $derived(
    [
      'ix-sidebar',
      shell.collapsed ? 'ix-sidebar--collapsed' : '',
      shell.mobileOpen ? 'ix-sidebar--mobile-open' : '',
    ].filter(Boolean).join(' '),
  );
  const avatarInitial = $derived(user?.name?.charAt(0)?.toUpperCase() ?? 'U');
  // `string` explícito: SvelteKit tipa `pathname` según la tabla de rutas del
  // proyecto, y esta librería no tiene rutas propias — así queda como
  // `"/" | `/${string}/``, y cualquier comparación con una ruta del consumidor
  // (ej. '/dashboard') se reporta como "sin solapamiento". Para una librería el
  // pathname ES un string arbitrario: el DS no puede conocer las rutas de quien
  // lo consume.
  const pathname: string = $derived($page.url.pathname);

  function isActive(href: string): boolean {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  }
</script>

<aside class={sidebarCls} aria-label="Navegación">

  <!-- La marca lleva a Inicio, contraído o no. Contraer y expandir es del
       botón de menú de la barra de arriba: el mismo en la computadora y en
       el celular. -->
  <div class="ix-brand ix-sidebar__header">
    <a class="ix-brand__home-link" href="/dashboard" aria-label="Ir al inicio" title={shell.collapsed ? appName : undefined}>
      <div class="ix-brand__logo-wrap">
        {#if logoSrc}
          <img class="ix-brand__logo-img" src={logoSrc} alt="{appName} logo" />
        {:else}
          <svg class="ix-brand__logo-img" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect width="24" height="24" rx="6" fill="var(--ix-color-primary)" />
            <path d="M7 8h10M7 12h7M7 16h4" stroke="white" stroke-width="2" stroke-linecap="round" />
          </svg>
        {/if}
      </div>
      {#if !shell.collapsed}<span class="ix-brand__name">{appName}</span>{/if}
    </a>
  </div>

  <nav class="ix-nav" aria-label="Navegación principal">
    {#each nav as section (section.label)}
      <div>
        <div class="ix-nav__section-label">{section.label}</div>
        {#each section.items as item (item.key)}
          <a
            href={item.href}
            class={isActive(item.href) ? 'ix-nav-item ix-nav-item--active' : 'ix-nav-item'}
            title={item.label}
          >
            <span class="ix-nav-item__icon" aria-hidden="true">
              <IxIcon name={item.icon} size={15} ariaHidden />
            </span>
            <span class="ix-nav-item__label">{item.label}</span>
          </a>
        {/each}
      </div>
    {/each}
  </nav>

  <!-- La versión es para soporte, no para el día a día: abajo, chica, y solo
       con el menú expandido. -->
  {#if !shell.collapsed}
    <div class="ix-sidebar__footer">
      {#if footer}{@render footer()}{:else}{appName} {version}{/if}
    </div>
  {/if}
</aside>
