<script>
import {t} from '$lib/store/t'
import SelectInput from "$lib/components/common/SelectInput.svelte"
import FktInput from "$lib/components/common/FkInput.svelte";
import {Input} from "flowbite-svelte";
import {FieldEvent} from "formkit"
import {POST_TYPES} from "$lib/constants"


export let field

let selected = field.value
let items = Object.keys(POST_TYPES).map((item) => {
  return { value: item, name: $t(`postTypes.${item}`) }
})

const handleSelect = (event) => {
  console.log(222, event.detail)
}

const handleInputMount = (field) => {
  field.on(FieldEvent.change, (data) => {
    selected = data.value
  })
}

</script>

<FktInput {field} let:disabled handleMount={handleInputMount}>
  <SelectInput
    {items}
    on:select={handleSelect}
    on:focus={() => field.handleFocusIn()}
    on:blur={() => field.handleBlur()}
    bind:selected
    {disabled}
  />
</FktInput>
