<script lang="ts">
  /**
   * Una barra de carga con la forma de lo que viene. Ocupa el lugar del dato
   * para que, cuando llegue, nada se corra. Decorativa: el anuncio de que algo
   * carga lo hace el contenedor (`IxSkeletonTable`, `IxSkeletonText`).
   */
  interface Props {
    width?:  string;
    height?: string;
    class?:  string;
  }
  let { width = '100%', height = '0.9em', class: extraClass = '' }: Props = $props();
</script>

<span class={['ix-skeleton', 'ix-skeleton--bar', extraClass].filter(Boolean).join(' ')} style="width: {width}; height: {height}" aria-hidden="true"></span>
