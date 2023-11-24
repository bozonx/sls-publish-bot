<script>
import { Label, Helper } from 'flowbite-svelte'
import {onMount} from 'svelte'
import FktInput from '$lib/components/common/FkInput.svelte'

export let label = undefined
export let hint = undefined
export let success = undefined
export let placeholder = undefined
export let custom = undefined
export let form
export let name
export let initial = null

// TODO: а если уже созданно? то не установится получается
const schema = {
  label,
  hint,
  success,
  placeholder,
  custom,
}

</script>

<div class="mb-5">
  <FktInput
    {form}
    {name}
    {initial}
    {schema}
    let:valid
    let:invalidMsg
    let:field
    let:label
    let:hint
    let:success
  >
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
      <div class="mt-1 text-sm text-red-500">{invalidMsg}</div>
    {/if}
    {#if success}
      <div class="mt-1 text-sm text-green-500">{success}</div>
    {/if}
    {#if hint}
      <div class="mt-1 text-sm text-gray-400 dark:text-gray-600">{hint}</div>
    {/if}
  </FktInput>
</div>
