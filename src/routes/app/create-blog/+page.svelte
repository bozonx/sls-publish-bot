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

// TODO: add hint - только safe символы
// TODO: validate

</script>

<div>
  <SectionHeader>{$t('links.createBlog')}</SectionHeader>

  <FkForm let:form {handleSubmit}>
    <FormRow
      label={$t('chunks.blogName')}
      {form}
      name="blogName"
      let:field
    >
      <FkTextInput {field} />
    </FormRow>

    <Button on:click={form.handleSubmit()}>{$t('chunks.create')}</Button>
  </FkForm>

</div>
