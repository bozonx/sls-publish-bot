<script>
  import { Alert } from 'flowbite-svelte'
  import { page } from '$app/stores'
</script>

<Alert color="red">
  <span>{$page.status}: {$page.error.message}</span>
</Alert>
