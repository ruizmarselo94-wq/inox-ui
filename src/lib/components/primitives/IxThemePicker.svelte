<script lang="ts">
  import type { Theme, AccentColor } from '../../types.js';
  import { useShell } from '../../shell.svelte.js';
  import IxIcon from './IxIcon.svelte';

  const shell = useShell();

  let open = $state(false);

  const triggerIcon = $derived(
    shell.theme === 'light'     ? 'sun'      :
    shell.theme === 'carbon'    ? 'layers'   :
    shell.theme === 'stainless' ? 'sparkles' :
    shell.theme === 'titanium'  ? 'gem'      : 'moon'
  );

  const THEMES: { value: Theme; label: string; icon: string }[] = [
    { value: 'dark',      label: 'Oscuro',   icon: 'moon'     },
    { value: 'light',     label: 'Claro',    icon: 'sun'      },
    { value: 'carbon',    label: 'Carbono',  icon: 'layers'   },
    { value: 'stainless', label: 'Acero',    icon: 'sparkles' },
    { value: 'titanium',  label: 'Titanio',  icon: 'gem'      },
  ];

  const ACCENTS: { value: AccentColor; label: string; color: string }[] = [
    { value: 'rust',  label: 'Óxido', color: '#f97316' },
    { value: 'steel', label: 'Acero', color: '#38bdf8' },
  ];

  function selectTheme(t: Theme) {
    shell.setTheme(t);
    if (t === 'carbon' || t === 'stainless' || t === 'titanium') open = false;
  }

  function selectAccent(a: AccentColor) {
    shell.setAccent(a);
  }

  function onGlobalKey(e: KeyboardEvent) {
    if (e.key === 'Escape' && open) {
      e.stopPropagation();
      open = false;
    }
  }
</script>

<svelte:window onkeydown={onGlobalKey} />

<div class="ix-theme-picker">
  <button
    class="ix-btn-icon"
    type="button"
    onclick={() => { open = !open; }}
    title="Apariencia"
    aria-label="Cambiar apariencia"
    aria-expanded={open}
    aria-haspopup="dialog"
  >
    <IxIcon name={triggerIcon} size={14} ariaHidden />
  </button>

  {#if open}
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div class="ix-theme-picker__backdrop" onclick={() => { open = false; }} aria-hidden="true"></div>

    <div class="ix-theme-picker__panel" role="dialog" aria-label="Apariencia">

      <div class="ix-theme-picker__group">
        <span class="ix-theme-picker__label">Modo</span>
        <div class="ix-theme-picker__row">
          {#each THEMES as t (t.value)}
            <button
              class="ix-theme-picker__opt"
              class:ix-theme-picker__opt--active={shell.theme === t.value}
              type="button"
              onclick={() => selectTheme(t.value)}
              title={t.label}
            >
              <IxIcon name={t.icon} size={13} ariaHidden />
              <span>{t.label}</span>
            </button>
          {/each}
        </div>
      </div>

      {#if shell.theme !== 'carbon' && shell.theme !== 'stainless' && shell.theme !== 'titanium'}
        <div class="ix-theme-picker__divider"></div>
        <div class="ix-theme-picker__group">
          <span class="ix-theme-picker__label">Acento</span>
          <div class="ix-theme-picker__row">
            {#each ACCENTS as a (a.value)}
              <button
                class="ix-theme-picker__opt"
                class:ix-theme-picker__opt--active={shell.accent === a.value}
                type="button"
                onclick={() => selectAccent(a.value)}
                title={a.label}
              >
                <span class="ix-theme-picker__swatch" style="background:{a.color}"></span>
                <span>{a.label}</span>
              </button>
            {/each}
          </div>
        </div>
      {/if}

    </div>
  {/if}
</div>
