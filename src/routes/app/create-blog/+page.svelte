<script>
import {Button} from 'flowbite-svelte'
import {deepMerge} from 'squidlet-lib'
import { page } from '$app/stores'
import {breadcrumbs} from '$lib/store/breadcrumbs'
import {squidletAppApi} from "$lib/squidletAppApi"
import {t} from "$lib/store/t"
import AppConfigForm from '$lib/components/AppConfigForm.svelte'
import SectionHeader from '$lib/components/SectionHeader.svelte'
import FkForm from "$lib/components/common/FkForm.svelte";
import FkTextInput from "$lib/components/common/FkTextInput.svelte";
import FormRow from "$lib/components/common/FormRow.svelte";
import FkSubmitButton from "$lib/components/common/FkSubmitButton.svelte";
import {pushToast} from "$lib/store/toasts"
import {goto} from '$app/navigation'


export let data

breadcrumbs.set([{title: $t('links.createBlog')}])

const handleSubmit = ({blogName}) => {
  (async () => {
    await squidletAppApi.createBlog(blogName)

    goto(`/app/${blogName}`)
  })()
    .catch((e) => pushToast({
      text: `Can't save: ${e}`,
      purpose: 'error'
    }))
}

const validateCb = (errors, {blogName}) => {
  if (!blogName) errors.blogName = $t('messages.emptyField')
  else if (!blogName.match(/^[a-zA-Z\d\-_.()\[\]]+$/)) errors.blogName = $t('messages.wrongSymbols')
}

</script>

<div>
  <SectionHeader>{$t('links.createBlog')}</SectionHeader>

  <FkForm let:form {handleSubmit} {validateCb}>
    <FormRow
      {form}
      name="blogName"
      let:field
      label={$t('chunks.blogName')}
      hint={$t('hints.blogName')}
      placeholder={$t('placeholders.blogName')}
    >
      <FkTextInput {field} />
    </FormRow>

    <FkSubmitButton {form}>{$t('chunks.create')}</FkSubmitButton>
  </FkForm>

</div>
