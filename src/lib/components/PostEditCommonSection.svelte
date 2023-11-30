<script>
import { arraySimilar } from 'squidlet-lib'
import {Button, Modal, Textarea, Checkbox} from 'flowbite-svelte'
import {t} from '$lib/store/t'
import FkTextInput from "$lib/components/common/FkTextInput.svelte"
import FkTextArea from "$lib/components/common/FkTextArea.svelte"
import FormRow from "$lib/components/common/FormRow.svelte"
import SelectTags from "$lib/components/SelectTags.svelte";


export let meta
export let blog
export let form

</script>

<FormRow
  label={$t('details.tags')}
  {form}
  name="common.tags"
  initial={meta.common?.tags}
  let:field
>
  <SelectTags {field} />
</FormRow>

<FormRow
  label={$t('details.contentLinks')}
  {form}
  name="common.contentLinks"
  initial={meta.common?.contentLinks}
  let:field
>
  <FkTextArea {field} />
</FormRow>

<FormRow
  label={$t('details.pubDateTime')}
  {form}
  name="common.pubDateTime"
  initial={meta.common?.pubDateTime}
  let:field
>
  <FkTextInput {field} />
</FormRow>
