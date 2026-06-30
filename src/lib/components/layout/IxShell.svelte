<script lang="ts">
  import type { Snippet } from 'svelte';
  import { onMount, untrack } from 'svelte';
  import type { Theme, LayoutMode, NavSection, UserProfile } from '../../types.js';
  import { provideShell } from '../../shell.svelte.js';
  import IxSidebar from './IxSidebar.svelte';
  import IxTopbar from './IxTopbar.svelte';

  interface Props {
    nav: NavSection[];
    user?: UserProfile;
    theme?: Theme;
    layout?: LayoutMode;
    collapsed?: boolean;
    logoSrc?: string;
    appName?: string;
    version?: string;
    onSignOut?: () => void;
    actions?: Snippet;
    children: Snippet;
  }

  let {
    nav,
    user,
    theme = 'dark',
    layout = 'sidebar',
    collapsed = false,
    logoSrc,
    appName = 'Bender',
    version = 'v0.1',
    onSignOut,
    actions,
    children,
  }: Props = $props();

  const shell = untrack(() => provideShell({ theme, layout, collapsed }));

  onMount(() => {
    shell.loadFromStorage();
  });
</script>

<div class="ix-shell" data-layout={shell.layout}>
  <!-- Backdrop mobile — toque fuera del sidebar cierra el drawer -->
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div
    class={shell.mobileOpen ? 'ix-shell__backdrop ix-shell__backdrop--visible' : 'ix-shell__backdrop'}
    onclick={() => shell.closeMobile()}
    aria-hidden="true"
  ></div>

  <IxSidebar {nav} {user} {logoSrc} {appName} {version} {onSignOut} />
  <div class="ix-main-container">
    <IxTopbar {nav} {user} {onSignOut} {actions} />
    <div class="ix-page-slot">
      {@render children()}
    </div>
  </div>
</div>
