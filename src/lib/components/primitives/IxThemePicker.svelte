<script lang="ts">
  import { useShell } from '../../shell.svelte.js';
  import IxIcon from './IxIcon.svelte';

  const shell = useShell();

  // Tres modos, en el orden en que cicla el botón: claro → oscuro → sistema.
  // El nombre es el que lee la persona: el del código —`system`— se colaba
  // en el tooltip en inglés.
  const meta = {
    light:  { icon: 'sun',     name: 'claro',       next: 'a oscuro'       },
    dark:   { icon: 'moon',    name: 'oscuro',      next: 'al del sistema' },
    system: { icon: 'monitor', name: 'del sistema', next: 'a claro'        },
  } as const;

  const current = $derived(meta[shell.theme]);
  const label = $derived(`Tema ${current.name}. Cambiar ${current.next}`);
</script>

<button
  class="ix-btn-icon"
  type="button"
  onclick={() => shell.toggleTheme()}
  title={label}
  aria-label={label}
>
  <IxIcon name={current.icon} size={14} ariaHidden />
</button>
