<script lang="ts">
  import type { Snippet } from 'svelte';
  import { goto } from '$app/navigation';
  import type { NavSection, UserProfile } from '../../types.js';
  import { useShell } from '../../shell.svelte.js';
  import IxIcon from '../primitives/IxIcon.svelte';
  import IxFlag from '../primitives/IxFlag.svelte';
  import IxThemePicker from '../primitives/IxThemePicker.svelte';

  interface Props {
    nav?:           NavSection[];
    user?:       UserProfile;
    onSignOut?: () => void;
    actions?:       Snippet;
  }

  let { nav = [], user, onSignOut, actions }: Props = $props();

  const shell       = useShell();
  const avatarLetra = $derived(user?.name?.charAt(0)?.toUpperCase() ?? 'U');

  // ── Command palette ─────────────────────────────────────────
  let paletteOpen = $state(false);
  let query       = $state('');
  let activeIdx   = $state(0);
  let inputEl     = $state<HTMLInputElement | null>(null);

  const allItems = $derived(
    nav.flatMap(s => s.items.map(item => ({ ...item, section: s.label })))
  );

  const results = $derived(
    query.trim() === ''
      ? allItems
      : allItems.filter(item =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.section.toLowerCase().includes(query.toLowerCase())
        )
  );

  $effect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    results; activeIdx = 0;
  });

  function openPalette() {
    paletteOpen = true;
    query       = '';
    activeIdx   = 0;
    setTimeout(() => inputEl?.focus(), 0);
  }

  function closePalette() {
    paletteOpen = false;
    query       = '';
  }

  function navigate(href: string) {
    closePalette();
    goto(href);
  }

  function onPaletteKey(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, results.length - 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); }
    else if (e.key === 'Enter' && results[activeIdx]) { navigate(results[activeIdx].href); }
    else if (e.key === 'Escape') { closePalette(); }
  }

  function onGlobalKey(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      paletteOpen ? closePalette() : openPalette();
    }
  }
</script>

<svelte:window onkeydown={onGlobalKey} />

<header class="ix-topbar">

  <!-- ── Izquierda: drawer toggle + brand/nav (topbar mode) + buscador ── -->
  <div class="ix-topbar__left">
    <button
      class="ix-btn-icon ix-topbar__hamburger"
      type="button"
      onclick={() => shell.toggleMobile()}
      aria-label={shell.mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
      title={shell.mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
    >
      <IxIcon name={shell.mobileOpen ? 'x' : 'menu'} size={16} ariaHidden />
    </button>

    <div class="ix-topbar__brand" aria-hidden="true"></div>

    {#if nav.length > 0}
      <nav class="ix-topbar__nav" aria-label="Navegación">
        {#each nav.flatMap(s => s.items) as item (item.key)}
          <a href={item.href} class="ix-topbar-nav-item">
            <IxIcon name={item.icon} size={13} ariaHidden />
            <span>{item.label}</span>
          </a>
        {/each}
      </nav>
    {/if}

    <button
      class="ix-topbar__search"
      type="button"
      onclick={openPalette}
      aria-label="Búsqueda rápida"
      aria-keyshortcuts="Control+K"
    >
      <IxIcon name="search" size={13} ariaHidden />
      <span class="ix-topbar__search-label">Buscar...</span>
      <kbd class="ix-topbar__search-kbd">Ctrl K</kbd>
    </button>
  </div>

  <!-- ── Centro: contexto operativo ──────────────────────────────────── -->
  <div class="ix-topbar__center">
    {#if user?.companyName}
      <IxFlag country="PY" width={24} />
      <span class="ix-topbar__context-text">
        {user.companyName}
        {#if user.branchName}<span class="ix-topbar__context-sep">›</span>{user.branchName}{/if}
        {#if user.registerName}<span class="ix-topbar__context-sep">›</span>{user.registerName}{/if}
      </span>
    {/if}
  </div>

  <!-- ── Derecha: acciones + user ─────────────────────────────────── -->
  <div class="ix-topbar__right">
    {#if actions}{@render actions()}{/if}

    <IxThemePicker />

    {#if user}
      <div class="ix-topbar__user">
        <div class="ix-avatar ix-avatar--sm" aria-hidden="true">
          {#if user.avatarSrc}
            <img src={user.avatarSrc} alt="" width="28" height="28" style="width:100%;height:100%;object-fit:contain;border-radius:inherit" />
          {:else}
            {avatarLetra}
          {/if}
        </div>
        <div class="ix-topbar__user-info">
          <span class="ix-topbar__user-name">{user.name}</span>
          <span class="ix-topbar__user-role">{user.role}</span>
        </div>
        {#if onSignOut}
          <button
            class="ix-btn-icon"
            type="button"
            onclick={onSignOut}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <IxIcon name="log-out" size={14} ariaHidden />
          </button>
        {/if}
      </div>
    {/if}
  </div>

</header>

<!-- ── Command palette ──────────────────────────────────────── -->
{#if paletteOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="ix-palette-overlay" onclick={closePalette} aria-hidden="true"></div>

  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    class="ix-palette"
    role="dialog"
    aria-modal="true"
    aria-label="Búsqueda rápida"
    tabindex="-1"
    onkeydown={onPaletteKey}
  >
    <div class="ix-palette__header">
      <IxIcon name="search" size={16} ariaHidden />
      <input
        bind:this={inputEl}
        bind:value={query}
        class="ix-palette__input"
        type="text"
        placeholder="Buscar pantalla..."
        autocomplete="off"
        spellcheck={false}
      />
      <button class="ix-palette__esc" type="button" onclick={closePalette} aria-label="Cerrar">Esc</button>
    </div>

    <ul class="ix-palette__list" role="listbox" aria-label="Resultados de búsqueda">
      {#if results.length === 0}
        <li class="ix-palette__empty">Sin resultados para "{query}"</li>
      {:else}
        {#each results as item, i (item.key)}
          <li role="option" aria-selected={i === activeIdx}>
            <!-- svelte-ignore a11y_click_events_have_key_events a11y_interactive_supports_focus -->
            <a
              href={item.href}
              class={i === activeIdx ? 'ix-palette__item ix-palette__item--active' : 'ix-palette__item'}
              onclick={(e) => { e.preventDefault(); navigate(item.href); }}
              onmouseenter={() => { activeIdx = i; }}
            >
              <span class="ix-palette__item-icon">
                <IxIcon name={item.icon} size={15} ariaHidden />
              </span>
              <span class="ix-palette__item-label">{item.label}</span>
              <span class="ix-palette__item-section">{item.section}</span>
            </a>
          </li>
        {/each}
      {/if}
    </ul>

    {#if results.length > 0}
      <div class="ix-palette__footer">
        <span><kbd>↑↓</kbd> navegar</span>
        <span><kbd>Enter</kbd> abrir</span>
        <span><kbd>Esc</kbd> cerrar</span>
      </div>
    {/if}
  </div>
{/if}
