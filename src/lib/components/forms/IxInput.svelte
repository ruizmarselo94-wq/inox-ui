<script lang="ts">
  import { onMount } from 'svelte';
  import IxIcon from '../primitives/IxIcon.svelte';

  interface Props {
    label?: string;
    placeholder?: string;
    value?: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
    /** Sólo `type="number"`: límites y paso del control nativo. Sin ellos el
     * input acepta cualquier número (negativos incluidos). */
    min?: number;
    max?: number;
    step?: number;
    /** Teclado virtual sugerido en mobile — útil en `type="number"`. */
    inputmode?: 'numeric' | 'decimal' | 'text' | 'tel';
    /** Sólo `type="number"`: reemplaza las flechas nativas por botones −/+
     * consistentes (respeta `min`/`max`/`step`). El input sigue aceptando
     * las flechas del teclado para el usuario que teclea. */
    stepper?: boolean;
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
    min,
    max,
    step,
    inputmode,
    stepper = false,
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

  // Stepper numérico: botones −/+ que reemplazan las flechas nativas.
  const showStepper = $derived(stepper && type === 'number');
  const numValue = $derived(value === '' ? Number.NaN : Number(value));
  const atMin = $derived(min !== undefined && !Number.isNaN(numValue) && numValue <= min);
  const atMax = $derived(max !== undefined && !Number.isNaN(numValue) && numValue >= max);

  // Suma/resta `step` (o 1) partiendo del valor actual (o `min`/0 si está
  // vacío), clampeando a `min`/`max`. Escribe de vuelta en el binding.
  function nudge(dir: 1 | -1) {
    const s = step ?? 1;
    const base = Number.isNaN(numValue) ? (min ?? 0) : numValue;
    let next = base + dir * s;
    if (min !== undefined && next < min) next = min;
    if (max !== undefined && next > max) next = max;
    value = String(next);
  }

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
      {min}
      {max}
      {step}
      {inputmode}
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
  {:else if showStepper}
    <!-- Botones −/+ para puntero/touch; el input queda operable por teclado
         (flechas nativas), por eso los botones son tabindex="-1". -->
    <div class="ix-stepper">
      <button
        type="button"
        class="ix-stepper__btn"
        onclick={() => nudge(-1)}
        disabled={disabled || atMin}
        aria-label="Disminuir"
        tabindex="-1"
      >−</button>
      {@render control()}
      <button
        type="button"
        class="ix-stepper__btn"
        onclick={() => nudge(1)}
        disabled={disabled || atMax}
        aria-label="Aumentar"
        tabindex="-1"
      >+</button>
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
