<script>
export let href = null
</script>


<a
  on:click
  {href}
  class="block px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
><slot /></a>
