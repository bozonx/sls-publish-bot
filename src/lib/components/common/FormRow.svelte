<script>
import { Label, Helper } from 'flowbite-svelte'
import FktInput from '$lib/components/common/FkInput.svelte'

export let label = ''
export let form
export let name
</script>

<div>
  <FktInput {form} {name} let:valid let:invalidMsg let:field>
    <Label for={name} class="block mb-2">{label}</Label>
    <div>
      <slot {field} />
    </div>
    {#if $$slots.helper}
      <Helper class="text-sm mt-2">
        <slot name="helper" />
      </Helper>
    {/if}
    {#if !valid}
      <div>
        {invalidMsg}
      </div>
    {/if}
    <!--<div>
      success
    </div>-->
  </FktInput>
</div>
