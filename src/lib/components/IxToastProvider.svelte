<script lang="ts">
  import type { Snippet } from 'svelte';
  import { provideToast } from '../toast.svelte.js';
  import IxToast from './IxToast.svelte';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  const toast = provideToast();
</script>

{@render children()}
<IxToast {toast} />
