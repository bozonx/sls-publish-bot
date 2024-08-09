<script>
import {Textarea} from 'flowbite-svelte'
import FktInput from "$lib/components/common/FkInput.svelte"
import {FieldEvent} from "formkit"


export let field
export let placeholder = null
export let rows = 4
export let label = null
export let readonly = null

let value = field.value

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
</script>

<FktInput {field} let:disabled let:valid handleMount={handleInputMount}>
  <Textarea
    on:change={(event) => field.handleChange(event.target.value)}
    on:focus={() => field.handleFocusIn()}
    on:blur={() => field.handleBlur()}
    on:keypress={(event) => event.code === 'Enter' && field.handleEndEditing()}
    bind:value
    {name}
    {placeholder}
    {disabled}
    {readonly}
    {rows}
    {label}
    color={resolveColor(valid)}
  />
</FktInput>
