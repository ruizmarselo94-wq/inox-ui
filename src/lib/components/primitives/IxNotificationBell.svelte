<script lang="ts">
  import { goto } from '$app/navigation';
  import type { AlertItem } from '../../types.js';
  import IxIcon from './IxIcon.svelte';

  interface Props {
    items?:   AlertItem[];
    loading?: boolean;
  }

  let { items = [], loading = false }: Props = $props();

  let open = $state(false);

  const total = $derived(items.reduce((s, i) => s + i.count, 0));
  const badgeLabel = $derived(total > 99 ? '99+' : String(total));

  function toggle() { open = !open; }
  function close()  { open = false; }

  function navigate(href: string) {
    close();
    goto(href);
  }
</script>

<div class="ix-notification-bell">
  <button
    class="ix-btn-icon ix-notification-bell__btn"
    type="button"
    onclick={toggle}
    aria-label={total > 0 ? `Alertas: ${total}` : 'Sin alertas'}
    aria-expanded={open}
    title="Alertas"
  >
    <IxIcon name="bell" size={16} ariaHidden />
    {#if total > 0}
      <span class="ix-notification-bell__badge" aria-hidden="true">{badgeLabel}</span>
    {/if}
  </button>

  {#if open}
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div class="ix-notification-bell__overlay" onclick={close} aria-hidden="true"></div>

    <div class="ix-notification-bell__panel" role="dialog" aria-label="Alertas activas">
      <div class="ix-notification-bell__header">
        <span>Alertas</span>
        {#if loading}
          <IxIcon name="loader" size={12} ariaHidden />
        {/if}
      </div>

      {#if items.length === 0}
        <p class="ix-notification-bell__empty">Sin alertas activas</p>
      {:else}
        <ul class="ix-notification-bell__list">
          {#each items as item (item.id)}
            <!-- svelte-ignore a11y_click_events_have_key_events a11y_interactive_supports_focus -->
            <li>
              <a
                href={item.href}
                class="ix-notification-bell__item ix-notification-bell__item--{item.variant}"
                onclick={(e) => { e.preventDefault(); navigate(item.href); }}
              >
                <span class="ix-notification-bell__item-dot" aria-hidden="true"></span>
                <span class="ix-notification-bell__item-label">{item.label}</span>
                <span class="ix-notification-bell__item-count">{item.count}</span>
              </a>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}
</div>
