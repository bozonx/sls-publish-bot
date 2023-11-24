<script>
import { Input } from 'flowbite-svelte'
import FktInput from '$lib/components/common/FkInput.svelte'
import {FieldEvent} from "formkit"


export let field
export let readonly = null
export let disabled = undefined

let value = field.value

// TODO: перенести в FormRow
if (typeof disabled !== 'undefined') field.setDisabled(disabled)

const resolveColor = (valid) => {
  if (!valid) color = 'red'
  //else if (error) color = 'green'
  else return null
}

const handleInputMount = (field) => {
  field.on(FieldEvent.change, (data) => {
    value = data.value
  })
}


// TODO: событие на on:input на каждое изменение с дебаунсом
// TODO: add placeholder
// TODO: add label

</script>

<FktInput {field} let:disabled let:valid let:placeholder handleMount={handleInputMount}>
  <Input
    on:change={(event) => field.handleChange(event.target.value)}
    on:focus={() => field.handleFocusIn()}
    on:blur={() => field.handleBlur()}
    on:keypress={(event) => event.code === 'Enter' && field.handleEndEditing()}
    bind:value
    {name}
    {placeholder}
    {disabled}
    {readonly}
    color={resolveColor(valid)}
    size="lg"
    class="w-full rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:placeholder-gray-400 dark:text-white border border-gray-200 dark:border-gray-600 p-2.5 text-sm focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500"
  >
    <!--<EnvelopeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />-->
  </Input>
</FktInput>
