<script>
import {t} from '$lib/store/t'
import SelectInput from "$lib/components/common/SelectInput.svelte"
import MultiSelectInput from "$lib/components/common/MultiSelectInput.svelte"
import FktInput from "$lib/components/common/FkInput.svelte";
import {Input} from "flowbite-svelte";
import {FieldEvent} from "formkit"
import {ALL_LANGS} from "$lib/constants"


export let field

let selected = field.value
let items = Object.keys(ALL_LANGS).map((item) => {
  return { value: item, name: item.toUpperCase() }
})


const handleInputMount = (field) => {
  field.on(FieldEvent.change, (data) => {
    selected = data.value
  })
}

</script>

<FktInput {field} let:disabled handleMount={handleInputMount}>
  <SelectInput
    {items}
    on:select={(event) => field.handleChange(event.detail)}
    on:focus={() => field.handleFocusIn()}
    on:blur={() => field.handleBlur()}
    bind:selected
    {disabled}
  />
</FktInput>
