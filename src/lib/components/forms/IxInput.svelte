<script lang="ts">
  import { onMount } from 'svelte';
  import IxIcon from '../primitives/IxIcon.svelte';

  interface Props {
    label?: string;
    placeholder?: string;
    value?: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    error?: string;
    hint?: string;
    id?: string;
    name?: string;
    autocomplete?: AutoFill;
    /** Foco automático al montar — solo en desktop/puntero fino. En touch
     * (`hover: none` + `pointer: coarse`) no hace nada, para no disparar el
     * teclado virtual apenas carga la página. Válido en el campo primario
     * de una página de propósito único (ej. login). */
    autofocus?: boolean;
    /** En campos `password`, agrega un botón mostrar/ocultar. */
    revealable?: boolean;
    class?: string;
    oninput?: (e: Event & { currentTarget: HTMLInputElement }) => void;
    onchange?: (e: Event & { currentTarget: HTMLInputElement }) => void;
    onblur?: (e: FocusEvent) => void;
  }

  let {
    label,
    placeholder,
    value = $bindable(''),
    type = 'text',
    disabled = false,
    readonly: readonlyProp = false,
    required = false,
    error,
    hint,
    id,
    name,
    autocomplete,
    autofocus = false,
    revealable = false,
    class: extraClass = '',
    oninput,
    onchange,
    onblur,
  }: Props = $props();

  let revealed = $state(false);
  const showReveal  = $derived(revealable && type === 'password');
  const currentType = $derived(showReveal && revealed ? 'text' : type);

  const inputId = $derived(id ?? `ix-input-${Math.random().toString(36).slice(2, 7)}`);
  const wrapperCls = $derived(
    ['ix-field', error ? 'ix-field--error' : '', extraClass].filter(Boolean).join(' '),
  );

  let inputEl: HTMLInputElement | undefined = $state();

  // `autofocus` is handled in JS, not the native HTML attribute: on touch
  // devices it pops the virtual keyboard the instant the page loads, before
  // the user has done anything — invasive rather than helpful. Desktop
  // (no coarse pointer) keeps the expected "land on the page ready to
  // type" behavior.
  onMount(() => {
    if (!autofocus) return;
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (!isTouch) inputEl?.focus();
  });
</script>

<div class={wrapperCls}>
  {#if label}
    <label class="ix-label" for={inputId}>
      {label}{#if required}<span class="ix-req" aria-hidden="true">*</span>{/if}
    </label>
  {/if}

  {#snippet control()}
    <input
      bind:this={inputEl}
      class="ix-input"
      type={currentType}
      id={inputId}
      {name}
      {placeholder}
      {disabled}
      readonly={readonlyProp}
      {required}
      {autocomplete}
      bind:value
      {oninput}
      {onchange}
      {onblur}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
    />
  {/snippet}

  {#if showReveal}
    <div class="ix-input-reveal">
      {@render control()}
      <button
        type="button"
        class="ix-input-reveal__toggle"
        onclick={() => (revealed = !revealed)}
        {disabled}
        aria-label={revealed ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        tabindex="-1"
      >
        <IxIcon name={revealed ? 'eye-off' : 'eye'} size={16} ariaHidden />
      </button>
    </div>
  {:else}
    {@render control()}
  {/if}

  {#if error}
    <span class="ix-field__error" id="{inputId}-error" role="alert">{error}</span>
  {:else if hint}
    <span class="ix-field__hint" id="{inputId}-hint">{hint}</span>
  {/if}
</div>
