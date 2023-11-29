<script>
import {t} from '$lib/store/t'
import SelectInput from "$lib/components/common/SelectInput.svelte"
import MultiSelectInput from "$lib/components/common/MultiSelectInput.svelte"
import FktInput from "$lib/components/common/FkInput.svelte";
import {Input} from "flowbite-svelte";
import {FieldEvent} from "formkit"
import {POST_TYPES} from "$lib/constants"


export let field
export let multi = false

let selected = field.value
let items = Object.keys(POST_TYPES).map((item) => {
  return { value: item, name: $t(`postTypes.${item}`) }
})


const handleInputMount = (field) => {
  field.on(FieldEvent.change, (data) => {
    selected = data.value
  })
}

</script>

<FktInput {field} let:disabled handleMount={handleInputMount}>
  {#if multi}
    <MultiSelectInput
      {items}
      on:select={(event) => field.handleChange(event.detail)}
      on:focus={() => field.handleFocusIn()}
      on:blur={() => field.handleBlur()}
      bind:selected
      {disabled}
    />
  {:else}
    <SelectInput
      {items}
      on:select={(event) => field.handleChange(event.detail)}
      on:focus={() => field.handleFocusIn()}
      on:blur={() => field.handleBlur()}
      bind:selected
      {disabled}
    />
  {/if}
</FktInput>
