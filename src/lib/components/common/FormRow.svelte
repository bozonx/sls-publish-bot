<script>
import { Label, Helper } from 'flowbite-svelte'

export let label = ''
// success text
export let success = ''
// error text
export let error = ''
export let forId
</script>

<div>
  <Label for={forId} class="block mb-2">{label}</Label>
  <div>
    <slot />
  </div>
  <Helper class="text-sm mt-2">
    <slot name="helper" />
  </Helper>
  <div>
    {error}
  </div>
  <div>
    {success}
  </div>
</div>
