<script lang="ts">
  import { page } from '$app/stores';
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
  }

  let {
    nav,
    user,
    logoSrc,
    appName = 'App',
    version = 'v0.1',
    onSignOut,
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

  {#if shell.collapsed}
    <!-- Colapsado: solo isotipo centrado, header clickeable, sin indicadores extra -->
    <button
      class="ix-brand ix-sidebar__header"
      type="button"
      onclick={() => shell.toggleCollapsed()}
      aria-label="Expandir menú"
      title="Expandir menú"
    >
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
    </button>
  {:else}
    <!-- Expandido: logo+nombre como link Home, chevron colapsa -->
    <div class="ix-brand ix-sidebar__header">
      <a class="ix-brand__home-link" href="/dashboard" aria-label="Ir al dashboard">
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
        <span class="ix-brand__name">{appName}</span>
      </a>
      <span class="ix-brand__version">{version}</span>
      <button
        class="ix-brand__collapse"
        type="button"
        onclick={() => shell.toggleCollapsed()}
        aria-label="Colapsar menú"
        title="Colapsar menú"
      >
        <IxIcon name="chevron-left" size={14} ariaHidden />
      </button>
    </div>
  {/if}

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


</aside>
