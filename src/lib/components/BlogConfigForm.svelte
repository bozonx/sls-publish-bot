<script>
import FormRow from '$lib/components/common/FormRow.svelte'
import FkForm from '$lib/components/common/FkForm.svelte'
import FkTextInput from '$lib/components/common/FkTextInput.svelte'


export let config

const initFields = {
  telegraphToken: {initial: config.telegraphToken}
}

const handleSave = async (values) => {
  console.log(444, values)
}
</script>


<FkForm let:form {initFields} on:save={handleSave} let:dirty>
  <FormRow label="Telegra.ph token" {form} name="telegraphToken" let:field>
    <FkTextInput {field} />
  </FormRow>

  {dirty}
</FkForm>
