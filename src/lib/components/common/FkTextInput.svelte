<script>
import { Input } from 'flowbite-svelte'
import FktInput from '$lib/components/common/FkInput.svelte'
import {FieldEvent} from "formkit"


export let field
export let placeholder = null
export let readonly = null

let value = null

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
// TODO: add hint
// TODO: add label
// TODO: add readonly
// TODO: add custom field data

</script>

<FktInput {field} let:disabled let:valid handleMount={handleInputMount}>
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
  >
    <!--<EnvelopeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />-->
  </Input>
</FktInput>
