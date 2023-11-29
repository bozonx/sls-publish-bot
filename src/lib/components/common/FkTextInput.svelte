<script>
import { Input } from 'flowbite-svelte'
import FktInput from '$lib/components/common/FkInput.svelte'
import {FieldEvent} from "formkit"
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

export let field
export let readonly = null
export let disabled = undefined

let value = field.value

// TODO: перенести в FormRow
if (typeof disabled !== 'undefined') field.setDisabled(disabled)

const resolveColor = (valid) => {
  if (!valid) return 'red'
  //else if (error) color = 'green'
  else return null
}

const handleInputMount = (field) => {
  field.on(FieldEvent.change, (data) => {
    value = data.value
  })
}

const onChange = (field, event) => {
  field.handleChange(event.target.value)
  dispatch('change', event.target.value)
}

const onKeyPress = (field, event) => {
  event.code === 'Enter' && field.handleEndEditing()
  dispatch('keypress', event)
}

const onFocus = (field) => {
  field.handleFocusIn()
  dispatch('focus')
}

const onBlur = (field) => {
  field.handleBlur()
  dispatch('blur')
}


// TODO: событие на on:input на каждое изменение с дебаунсом

// border-gray-200 dark:border-gray-600

</script>

<FktInput {field} let:disabled let:valid let:placeholder handleMount={handleInputMount}>
  <Input
    on:change={(event) => onChange(field, event)}
    on:focus={() => onFocus(field)}
    on:blur={() => onBlur(field)}
    on:keypress={(event) => onKeyPress(field, event)}
    bind:value
    {name}
    {placeholder}
    {disabled}
    {readonly}
    color={resolveColor(valid)}
    size="lg"
    class="w-full rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:placeholder-gray-400 dark:text-white border p-2.5 text-sm focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500"
  >
    <!--<EnvelopeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />-->
  </Input>
</FktInput>
