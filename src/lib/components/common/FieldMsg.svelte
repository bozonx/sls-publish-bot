<script>
export let error = false
export let success = false
export let hint = false
</script>

{#if error}
  <div class="mt-1 text-sm text-red-500"><slot /></div>
{:else if success}
  <div class="mt-1 text-sm text-green-500"><slot /></div>
{:else if hint}
  <div class="mt-1 text-sm text-gray-400 dark:text-gray-600"><slot /></div>
{/if}
