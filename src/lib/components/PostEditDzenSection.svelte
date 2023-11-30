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
  label={$t('details.template')}
  {form}
  name="dzen.template"
  initial={meta.dzen?.template}
  let:field
>
  <FkTextArea {field} />
</FormRow>

<FormRow
  label={$t('details.footer')}
  {form}
  name="dzen.footer"
  initial={meta.dzen?.footer}
  let:field
>
  <FkTextArea {field} />
</FormRow>

<FormRow
  label={$t('details.pubDateTime')}
  {form}
  name="dzen.pubDateTime"
  initial={meta.dzen?.pubDateTime}
  let:field
>
  <FkTextInput {field} />
</FormRow>