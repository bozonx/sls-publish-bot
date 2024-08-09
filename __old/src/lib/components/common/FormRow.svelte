<script>
import { Label, Helper } from 'flowbite-svelte'
import {onMount} from 'svelte'
import {FieldEvent} from "formkit"
import { createEventDispatcher } from 'svelte'
import FktInput from '$lib/components/common/FkInput.svelte'
import FieldMsg from '$lib/components/common/FieldMsg.svelte'

const dispatch = createEventDispatcher()


export let label = undefined
export let hint = undefined
export let success = undefined
export let placeholder = undefined
export let custom = undefined
export let form
export let name
export let initial = null
export let hidden = false

// TODO: а если уже созданно? то не установится получается
const schema = {
  label,
  hint,
  success,
  placeholder,
  custom,
}


const handleMount = (field) => {
  field.on(FieldEvent.change, ({value, prevValue}) => {
    dispatch('change', {field: form.fields[name],value, prevValue})
  })
}

</script>

<div class="mb-5 lg:flex w-full" {hidden}>
  <FktInput
    {form}
    {name}
    {initial}
    {schema}
    {handleMount}
    let:value
    let:field
    let:label
    let:hint
    let:success
    let:dirty
    let:touched
    let:valid
    let:invalidMsg
    let:saving
    let:focused
    let:disabled
    let:custom
  >
    <Label for={name} class="block mb-2 lg:w-40 pr-1">{label}</Label>
    <div class="flex-1">
      <slot
        {field}
        {value}
        {touched}
        {valid}
        {invalidMsg}
        {saving}
        {focused}
        {disabled}
        {custom}
      />

      {#if $$slots.helper}
        <Helper class="text-sm mt-2">
          <slot name="helper" />
        </Helper>
      {/if}
      {#if !valid}
        <FieldMsg error>{invalidMsg}</FieldMsg>
      {/if}
      {#if success}
        <FieldMsg success>{success}</FieldMsg>
      {/if}
      {#if hint}
        <FieldMsg hint>{hint}</FieldMsg>
      {/if}
    </div>
  </FktInput>
</div>
