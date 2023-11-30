<script>
export let label
export let unless = false
</script>

{#if !unless}
  <div class="flex items-start py-1 px-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
    <span class="mr-2 text-gray-500 w-40">{label}</span>
    <span class="flex-1"><slot /></span>
  </div>
{/if}
