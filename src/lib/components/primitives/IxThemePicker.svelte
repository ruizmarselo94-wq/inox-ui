<script lang="ts">
  import { useShell } from '../../shell.svelte.js';
  import IxIcon from './IxIcon.svelte';

  const shell = useShell();

  const label = $derived(
    shell.theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro',
  );
</script>

<button
  class="ix-btn-icon"
  type="button"
  onclick={() => shell.toggleTheme()}
  title={label}
  aria-label={label}
>
  <IxIcon name={shell.theme === 'dark' ? 'moon' : 'sun'} size={14} ariaHidden />
</button>
