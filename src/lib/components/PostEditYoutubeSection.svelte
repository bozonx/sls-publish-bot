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
  name="youtube.tags"
  initial={meta.youtube?.tags}
  let:field
>
  <FkTextInput {field} />
</FormRow>

<FormRow
  label={$t('details.template')}
  {form}
  name="youtube.template"
  initial={meta.youtube?.template}
  let:field
>
  <FkTextArea {field} />
</FormRow>

<FormRow
  label={$t('details.footer')}
  {form}
  name="youtube.footer"
  initial={meta.youtube?.footer}
  let:field
  hint={$t('hints.footerField')}
>
  <FkTextArea {field} />
</FormRow>

<FormRow
  label={$t('details.contentLinks')}
  {form}
  name="youtube.contentLinks"
  initial={meta.youtube?.contentLinks}
  let:field
>
  <FkTextArea {field} />
</FormRow>

<FormRow
  label={$t('details.pubDateTime')}
  {form}
  name="youtube.pubDateTime"
  initial={meta.youtube?.pubDateTime}
  let:field
>
  <FkTextInput {field} />
</FormRow>