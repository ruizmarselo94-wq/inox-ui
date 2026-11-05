<script lang="ts">
  import type { Snippet } from 'svelte';
  import { goto } from '$app/navigation';
  import type { NavSection, UserProfile, ContextOption } from '../../types.js';
  import { useShell } from '../../shell.svelte.js';
  import IxIcon from '../primitives/IxIcon.svelte';
  import IxThemePicker from '../primitives/IxThemePicker.svelte';

  interface Props {
    nav?:           NavSection[];
    user?:       UserProfile;
    onSignOut?: () => void;
    actions?:       Snippet;
    /** A qué se puede pasar desde el primer nivel del contexto operativo. Con
     *  dos o más y `onContextSelect`, ese nivel se vuelve el botón que abre la
     *  lista; con menos, es texto, como siempre. */
    contexts?:        ContextOption[];
    onContextSelect?: (key: string) => void;
    /** El rótulo del botón y de la lista: «Cambiar de empresa». */
    contextLabel?:    string;
    /** Una acción al pie de la lista: «Nueva empresa». Con ella, el botón
     *  aparece aunque haya una sola opción —es la forma de descubrir que se
     *  puede tener otra—, como «Crear cuenta» en el selector de Stripe. */
    contextAction?:   { label: string; onSelect: () => void };
  }

  let {
    nav = [], user, onSignOut, actions, contexts = [], onContextSelect, contextLabel = 'Cambiar', contextAction,
  }: Props = $props();

  // ── Cambio de contexto ──────────────────────────────────────
  // El nombre de dónde se está es el control para pasarse a otro lado, como el
  // de la organización en Xero o el de la tienda en Shopify. En el celular el
  // contexto no entra en la barra, así que el mismo menú se abre desde un
  // botón de ícono. La lista va fuera de la barra, fija bajo el botón que la
  // abrió: el texto del contexto recorta lo que se le desborda.
  const canSwitch  = $derived(onContextSelect !== undefined && (contexts.length > 1 || contextAction !== undefined));
  const MENU_ITEMS = '[role="menuitemradio"], [role="menuitem"]';
  let switchOpen   = $state(false);
  let switchPos    = $state({ top: 0, left: 0 });
  let switchTrigger: HTMLElement | null = null;
  let switchMenu   = $state<HTMLElement | null>(null);

  function openSwitch(e: MouseEvent) {
    switchTrigger = e.currentTarget as HTMLElement;
    const r = switchTrigger.getBoundingClientRect();
    const width = 240;
    switchPos = { top: r.bottom + 6, left: Math.max(8, Math.min(r.left, window.innerWidth - width - 8)) };
    switchOpen = true;
    setTimeout(() => {
      const items = switchMenu?.querySelectorAll<HTMLElement>(MENU_ITEMS);
      const current = switchMenu?.querySelector<HTMLElement>('[aria-checked="true"]');
      (current ?? items?.[0])?.focus();
    }, 0);
  }

  function closeSwitch() {
    switchOpen = false;
    switchTrigger?.focus();
  }

  function pick(option: ContextOption) {
    switchOpen = false;
    if (!option.current) onContextSelect?.(option.key);
    else switchTrigger?.focus();
  }

  function onSwitchKey(e: KeyboardEvent) {
    const items = [...(switchMenu?.querySelectorAll<HTMLElement>(MENU_ITEMS) ?? [])];
    const at = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(at + 1) % items.length]?.focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[(at - 1 + items.length) % items.length]?.focus(); }
    else if (e.key === 'Escape' || e.key === 'Tab') { e.preventDefault(); closeSwitch(); }
  }

  const shell       = useShell();

  // Un solo botón de menú, en el mismo lugar: en la computadora contrae y
  // expande el menú; en el celular lo abre y lo cierra.
  let wide = $state(false);
  $effect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const sync = () => (wide = mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  });
  const menuOpen  = $derived(wide ? !shell.collapsed : shell.mobileOpen);
  const menuLabel = $derived(
    wide ? (shell.collapsed ? 'Expandir menú' : 'Contraer menú') : (shell.mobileOpen ? 'Cerrar menú' : 'Abrir menú'),
  );
  // La hamburguesa es «el menú» en cualquier equipo, como en Gmail y YouTube:
  // en la computadora contrae y expande; en el celular abre, y el menú abierto
  // se cierra con la ×. El panel con flecha de antes era más preciso, pero a
  // 16 px la flecha no se leía y nadie fuera de un editor lo reconoce.
  const menuIcon = $derived(!wide && shell.mobileOpen ? 'x' : 'menu');
  function toggleMenu() {
    if (wide) shell.toggleCollapsed();
    else shell.toggleMobile();
  }
  const avatarInitial = $derived(user?.name?.charAt(0)?.toUpperCase() ?? 'U');

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
    <!-- Sin borde (--bare), como el ≡ de Gmail: responde el ícono, que se
         colorea al apuntar; el anillo de foco sigue. 32 px con el ícono de 18:
         a 28 con 16 se veía chico al lado del buscador, que mide 32. -->
    <button
      class="ix-btn-icon ix-btn-icon--bare ix-btn-icon--lg ix-topbar__hamburger"
      type="button"
      onclick={toggleMenu}
      aria-label={menuLabel}
      aria-expanded={menuOpen}
      title={menuLabel}
    >
      <!-- {#key}: el ícono nuevo entra con una transición corta. -->
      {#key menuIcon}
        <span class="ix-topbar__menu-glyph"><IxIcon name={menuIcon} size={18} ariaHidden /></span>
      {/key}
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
    <!-- Acá había un `<IxFlag country="PY">` con el país FIJO en el markup:
         una bandera de Paraguay incrustada en un componente que se supone
         agnóstico de producto, o sea un bug para cualquier consumidor que no
         sea paraguayo. Se fue con IxFlag; si un contexto operativo necesita
         mostrar país, lo pasa el consumidor. -->
    {#if user?.companyName}
      <span class="ix-topbar__context-text">
        {#if canSwitch}
          <button
            class="ix-topbar__switch"
            type="button"
            onclick={openSwitch}
            aria-haspopup="menu"
            aria-expanded={switchOpen}
            title={contextLabel}
          >
            <span class="ix-topbar__switch-label">{user.companyName}</span>
            <IxIcon name="chevrons-up-down" size={13} ariaHidden />
          </button>
        {:else}
          {user.companyName}
        {/if}
        {#if user.branchName}<span class="ix-topbar__context-sep" aria-hidden="true">·</span>{user.branchName}{/if}
        {#if user.registerName}<span class="ix-topbar__context-sep" aria-hidden="true">·</span>{user.registerName}{/if}
      </span>
    {/if}
  </div>

  <!-- ── Derecha: acciones + user ─────────────────────────────────── -->
  <div class="ix-topbar__right">
    {#if canSwitch}
      <button
        class="ix-btn-icon ix-topbar__switch-icon"
        type="button"
        onclick={openSwitch}
        aria-haspopup="menu"
        aria-expanded={switchOpen}
        aria-label={user?.companyName ? `${contextLabel} · ${user.companyName}` : contextLabel}
        title={contextLabel}
      >
        <IxIcon name="building-2" size={16} ariaHidden />
      </button>
    {/if}
    {#if actions}{@render actions()}{/if}

    <IxThemePicker />

    {#if user}
      <div class="ix-topbar__user">
        <div class="ix-avatar ix-avatar--sm" aria-hidden="true">
          {#if user.avatarSrc}
            <img src={user.avatarSrc} alt="" width="28" height="28" style="width:100%;height:100%;object-fit:contain;border-radius:inherit" />
          {:else}
            {avatarInitial}
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

<!-- ── Cambio de contexto ───────────────────────────────────── -->
{#if switchOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="ix-topbar__switch-overlay" onclick={() => (switchOpen = false)} aria-hidden="true"></div>
  <div
    bind:this={switchMenu}
    class="ix-topbar__switch-menu"
    role="menu"
    tabindex="-1"
    aria-label={contextLabel}
    style={`top:${switchPos.top}px;left:${switchPos.left}px`}
    onkeydown={onSwitchKey}
  >
    <p class="ix-topbar__switch-title" aria-hidden="true">{contextLabel}</p>
    {#each contexts as option (option.key)}
      <button
        class="ix-topbar__switch-item"
        type="button"
        role="menuitemradio"
        aria-checked={option.current === true}
        onclick={() => pick(option)}
      >
        <span>{option.label}</span>
        {#if option.current}<IxIcon name="check" size={14} ariaHidden />{/if}
      </button>
    {/each}
    {#if contextAction}
      <button
        class="ix-topbar__switch-item ix-topbar__switch-action"
        type="button"
        role="menuitem"
        onclick={() => { switchOpen = false; contextAction.onSelect(); }}
      >
        <IxIcon name="plus" size={14} ariaHidden />
        <span>{contextAction.label}</span>
      </button>
    {/if}
  </div>
{/if}

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
