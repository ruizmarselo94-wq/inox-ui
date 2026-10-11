<script lang="ts">
  import { useShell } from '../../shell.svelte.js';
  import IxIcon from './IxIcon.svelte';

  const shell = useShell();

  // Tres modos, en el orden en que cicla el botón: claro → oscuro → sistema.
  const meta = {
    light:  { icon: 'sun',     next: 'oscuro'  },
    dark:   { icon: 'moon',    next: 'sistema' },
    system: { icon: 'monitor', next: 'claro'   },
  } as const;

  const current = $derived(meta[shell.theme]);
  const label = $derived(`Tema: ${shell.theme}. Cambiar a ${current.next}`);
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
