<script>
import FormRow from '$lib/components/common/FormRow.svelte'
import FkForm from '$lib/components/common/FkForm.svelte'
import FkTextInput from '$lib/components/common/FkTextInput.svelte'

</script>


<FkForm let:form>
  <FormRow label="Telegra.ph token" {form} name="tg-token">
    <FkTextInput {form} name="tg-token" />
  </FormRow>
</FkForm>
