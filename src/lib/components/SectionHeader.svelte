<script>
import {Heading} from 'flowbite-svelte'

export let unless = false
</script>

{#if !unless}
  <Heading tag="h4" class="text-md mb-2 mt-4 text-gray-600"><slot /></Heading>
{/if}
