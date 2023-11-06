<script>
  import FormRow from '$lib/components/common/FormRow.svelte'
  import FkForm from '$lib/components/common/FkForm.svelte'
  import FkTextInput from '$lib/components/common/FkTextInput.svelte'


  export let config
  export let handleSave = null
</script>


<FkForm let:form {handleSave}>
  <FormRow
    label="Telegram bot token"
    {form}
    name="telegramBotToken"
    initial={config.telegramBotToken}
    let:field
  >
    <FkTextInput {field} />
  </FormRow>
</FkForm>
