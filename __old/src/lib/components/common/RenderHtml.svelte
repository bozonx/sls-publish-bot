<script>
let className = ''

export { className as class }
export let id = null
export let html
export let tag = 'div'
</script>

<svelte:element this={tag} id={id} class="html-block {className}">
  {@html html}
</svelte:element>
