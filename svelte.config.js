import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // `kit.package` fue removido en SvelteKit reciente: `@sveltejs/package` v2
  // toma la config por flags de CLI y ya usa por defecto `dir: dist` + tipos,
  // que es exactamente lo que este bloque pedía. Dejarlo hacía fallar el load
  // del config (`Unexpected option config.kit.package`) y con eso `check`/`lint`.
  preprocess: vitePreprocess(),
};

export default config;
