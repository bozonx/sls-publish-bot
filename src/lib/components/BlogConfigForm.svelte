<script>
import FormRow from '$lib/components/common/FormRow.svelte'
import FkForm from '$lib/components/common/FkForm.svelte'
import FkTextInput from '$lib/components/common/FkTextInput.svelte'


export let config

const handleSave = async (values) => {
  console.log(444, values)
}
</script>


<FkForm let:form on:save={handleSave} let:dirty>
  <FormRow
    label="Telegra.ph token"
    {form}
    name="telegraphToken"
    initial={config.telegraphToken}
    let:field
  >
    <FkTextInput {field} />
  </FormRow>

  {dirty}
</FkForm>
