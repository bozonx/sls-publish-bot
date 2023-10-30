<script>
export let label
</script>

<div class="flex items-start py-1 border-b border-gray-200 hover:bg-gray-50">
  <span class="mr-2 text-gray-500 w-40">{label}:</span>
  <span><slot /></span>
</div>
