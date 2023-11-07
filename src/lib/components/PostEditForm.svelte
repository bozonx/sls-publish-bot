<script>
import FkForm from '$lib/components/common/FkForm.svelte'
import {t} from '$lib/store/t'
import FkTextInput from "$lib/components/common/FkTextInput.svelte"
import SelectPostType from "$lib/components/SelectPostType.svelte"
import FormRow from "$lib/components/common/FormRow.svelte"


export let handleSave = null
export let item

const meta = item.result.meta

console.log(111, meta)
</script>

<FkForm let:form {handleSave}>
  <FormRow
    label={$t('details.title')}
    {form}
    name="title"
    initial={meta.title}
    let:field
  >
    <FkTextInput {field} />
  </FormRow>
  <FormRow
    label="urlName"
    {form}
    name="urlName"
    initial={meta.urlName}
    let:value
  >
    {meta.urlName}
  </FormRow>
  <FormRow
    label={$t('details.type')}
    {form}
    name="type"
    initial={meta.type}
    let:field
  >
    <SelectPostType {field} />
  </FormRow>
</FkForm>
