<script lang="ts">
  import { tick } from 'svelte';

  interface Props {
    label?: string;
    placeholder?: string;
    /** Valor formateado y legible (ej. `0981 774 666`). */
    value?: string;
    disabled?: boolean;
    required?: boolean;
    error?: string;
    hint?: string;
    id?: string;
    name?: string;
    class?: string;
    onblur?: (e: FocusEvent) => void;
  }

  let {
    label,
    placeholder,
    value = $bindable(''),
    disabled = false,
    required = false,
    error,
    hint,
    id,
    name,
    class: extraClass = '',
    onblur,
  }: Props = $props();

  let inputEl = $state<HTMLInputElement>();
  const inputId    = $derived(id ?? `ix-tel-${Math.random().toString(36).slice(2, 7)}`);
  const wrapperCls = $derived(
    ['ix-field', error ? 'ix-field--error' : '', extraClass].filter(Boolean).join(' '),
  );

  function chunk(s: string, n: number): string[] {
    const out: string[] = [];
    for (let i = 0; i < s.length; i += n) out.push(s.slice(i, i + n));
    return out;
  }

  // Formato Paraguay — agrupa para legibilidad sin forzar longitud (móviles, fijos
  // y números internacionales conviven):
  //   - Local (empieza con 0):   0981 774 666   (4 / 3 / 3 …)
  //   - Internacional (con +):   +595 981 774 666
  //   - Otro:                    grupos de 3
  // Idempotente: format(format(x)) === format(x).
  function format(input: string): string {
    const intl   = input.trimStart().startsWith('+');
    const digits = input.replace(/\D/g, '');
    if (digits === '') return '';
    if (intl) {
      return `+${[digits.slice(0, 3), ...chunk(digits.slice(3), 3)].filter(Boolean).join(' ')}`;
    }
    if (digits.startsWith('0')) {
      return [digits.slice(0, 4), ...chunk(digits.slice(4), 3)].filter(Boolean).join(' ');
    }
    return chunk(digits, 3).join(' ');
  }

  async function onInput(e: Event & { currentTarget: HTMLInputElement }) {
    const el = e.currentTarget;
    const caret = el.selectionStart ?? el.value.length;
    // dígitos (y el +) antes del caret: el ancla estable para reposicionarlo
    const keep = el.value.slice(0, caret).replace(/[^\d+]/g, '').length;

    value = format(el.value);
    await tick();
    if (!inputEl) return;
    // Fuerza el DOM aunque `value` no haya cambiado (ej. se tipeó un carácter
    // inválido que se descarta): si no, quedaría visible en el input.
    inputEl.value = value;

    let pos = 0;
    let seen = 0;
    while (pos < value.length && seen < keep) {
      if (/[\d+]/.test(value[pos])) seen += 1;
      pos += 1;
    }
    inputEl.setSelectionRange(pos, pos);
  }
</script>

<div class={wrapperCls}>
  {#if label}
    <label class="ix-label" for={inputId}>
      {label}{#if required}<span class="ix-req" aria-hidden="true">*</span>{/if}
    </label>
  {/if}

  <input
    bind:this={inputEl}
    class="ix-input"
    type="tel"
    inputmode="tel"
    autocomplete="tel"
    id={inputId}
    {name}
    {placeholder}
    {disabled}
    {required}
    value={format(value)}
    oninput={onInput}
    {onblur}
    aria-invalid={error ? 'true' : undefined}
    aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
  />

  {#if error}
    <span class="ix-field__error" id="{inputId}-error" role="alert">{error}</span>
  {:else if hint}
    <span class="ix-field__hint" id="{inputId}-hint">{hint}</span>
  {/if}
</div>
