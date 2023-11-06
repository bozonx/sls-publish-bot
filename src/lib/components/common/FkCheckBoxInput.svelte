<script>
import {Checkbox, Input} from 'flowbite-svelte'
import {FieldEvent} from "formkit"
import FktInput from "$lib/components/common/FkInput.svelte";


export let field

let checkedValue = field.value || false

const handleInputMount = (field) => {
  field.on(FieldEvent.change, (data) => {
    checkedValue = data.value
  })
}
</script>

<FktInput {field} let:disabled handleMount={handleInputMount}>
  <Checkbox
    on:change={(event) => field.handleChange(event.target.checked)}
    on:focus={() => field.handleFocusIn()}
    on:blur={() => field.handleBlur()}
    bind:checked={checkedValue}
    {name}
    {disabled}
  ><slot /></Checkbox>
</FktInput>
