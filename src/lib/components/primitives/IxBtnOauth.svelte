<script lang="ts">
  // OAuth provider button — pairs with .ix-btn-oauth (style/components/_btn-oauth.scss).
  // Encapsulates the brand SVG so consumers never hand-copy logo markup: the
  // Google icon's four <path> elements must stay in blue/green/yellow/red
  // order for the CSS hover (:nth-child) to paint the right brand colors —
  // getting that order wrong when inlining by hand is an easy, silent bug.
  //
  // Only providers with a verified logo are supported here. The stylesheet
  // already has hover treatments for facebook/vk (and a --disabled modifier
  // for "shown but not wired up yet"), but this component doesn't guess at
  // logos it hasn't been given — add a provider here only once its SVG is
  // confirmed correct.
  interface Props {
    provider: 'google' | 'github';
    /** Where the button navigates — the design system doesn't assume any
     * app's backend routing convention, so the caller supplies the URL. */
    href: string;
    /** Provider shown in the UI but not wired up yet: renders inert
     * (`aria-disabled`, `tabindex="-1"`, no href) instead of a live link. */
    disabled?: boolean;
    class?: string;
  }

  let { provider, href, disabled = false, class: extraClass = '' }: Props = $props();

  const label = $derived(provider === 'google' ? 'Google' : 'GitHub');

  const cls = $derived(
    [
      'ix-btn-oauth',
      `ix-btn-oauth--${provider}`,
      disabled ? 'ix-btn-oauth--disabled' : '',
      extraClass,
    ]
      .filter(Boolean)
      .join(' '),
  );
</script>

{#snippet icon()}
  {#if provider === 'google'}
    <svg class="ix-btn-oauth__svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  {:else}
    <svg class="ix-btn-oauth__svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.2 3.44 9.61 8.2 11.17.6.11.82-.25.82-.56 0-.28-.01-1.02-.02-2-3.34.71-4.04-1.58-4.04-1.58-.55-1.37-1.33-1.74-1.33-1.74-1.09-.72.08-.71.08-.71 1.2.08 1.83 1.21 1.83 1.21 1.07 1.79 2.81 1.27 3.5.97.11-.76.42-1.27.76-1.56-2.67-.29-5.47-1.31-5.47-5.83 0-1.29.47-2.34 1.24-3.17-.12-.29-.54-1.48.12-3.09 0 0 1.01-.32 3.3 1.21a11.6 11.6 0 016 0c2.29-1.53 3.3-1.21 3.3-1.21.66 1.61.24 2.8.12 3.09.77.83 1.24 1.88 1.24 3.17 0 4.53-2.81 5.53-5.49 5.82.43.36.81 1.09.81 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.22.68.83.56A12.02 12.02 0 0024 12.29C24 5.78 18.63.5 12 .5z"/>
    </svg>
  {/if}
{/snippet}

{#if disabled}
  <span class={cls} aria-disabled="true" tabindex="-1">
    {@render icon()}
    {label}
  </span>
{:else}
  <a class={cls} {href}>
    {@render icon()}
    {label}
  </a>
{/if}
