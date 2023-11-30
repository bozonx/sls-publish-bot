<script>
import { arraySimilar } from 'squidlet-lib'
import {Button, Modal, Textarea, Checkbox} from 'flowbite-svelte'
import {t} from '$lib/store/t'
import FkTextInput from "$lib/components/common/FkTextInput.svelte"
import FkTextArea from "$lib/components/common/FkTextArea.svelte"
import FkCheckBoxInput from "$lib/components/common/FkCheckBoxInput.svelte"
import FormRow from "$lib/components/common/FormRow.svelte"
import {POST_TYPES} from "$lib/constants"
import SectionHeader from "$lib/components/SectionHeader.svelte";


export let meta
export let form

</script>

<FormRow
  label={$t('details.tags')}
  {form}
  name="podcast.tags"
  initial={meta.podcast?.tags}
  let:field
>
  <FkTextInput {field} />
</FormRow>

<FormRow
  label={$t('details.template')}
  {form}
  name="podcast.template"
  initial={meta.podcast?.template}
  let:field
>
  <FkTextArea {field} />
</FormRow>

<FormRow
  label={$t('details.footer')}
  {form}
  name="podcast.footer"
  initial={meta.podcast?.footer}
  let:field
  hint={$t('hints.footerField')}
>
  <FkTextArea {field} />
</FormRow>

<FormRow
  label={$t('details.contentLinks')}
  {form}
  name="podcast.contentLinks"
  initial={meta.podcast?.contentLinks}
  let:field
>
  <FkTextArea {field} />
</FormRow>

<FormRow
  label={$t('details.pubDateTime')}
  {form}
  name="podcast.pubDateTime"
  initial={meta.podcast?.pubDateTime}
  let:field
>
  <FkTextInput {field} />
</FormRow>