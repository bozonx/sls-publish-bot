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
import ReplaceDefaultField from "$lib/components/ReplaceDefaultField.svelte";
import CodeBlock from "$lib/components/common/CodeBlock.svelte";


export let meta
export let blog
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
  label={$t('details.pubDateTime')}
  {form}
  name="podcast.pubDateTime"
  initial={meta.podcast?.pubDateTime}
  let:field
>
  <FkTextInput {field} />
</FormRow>

<ReplaceDefaultField
  label={$t('details.useCustomLinks')}
  {form}
  name="podcast.useCustomLinks"
  initial={meta.podcast?.useCustomLinks}
>
  <FormRow
    label={$t('details.contentLinks')}
    {form}
    name="podcast.contentLinks"
    initial={meta.podcast?.contentLinks}
    let:field
  >
    <FkTextArea {field} />
  </FormRow>
</ReplaceDefaultField>

<ReplaceDefaultField
  label={$t('details.useCustomTemplate')}
  {form}
  name="podcast.useCustomTemplate"
  initial={meta.podcast?.useCustomTemplate}
  defaultValue={blog.config.podcast?.template}
  defaultValueLabel={$t('chunks.templateWillBeUsed')}
>
  <FormRow
    label={$t('details.template')}
    {form}
    name="podcast.template"
    initial={meta.podcast?.template}
    let:field
  >
    <FkTextArea {field} />
  </FormRow>
</ReplaceDefaultField>

<ReplaceDefaultField
  label={$t('details.useCustomFooter')}
  {form}
  name="podcast.useCustomFooter"
  initial={meta.podcast?.useCustomFooter}
  defaultValue={blog.config.podcast?.footer}
  defaultValueLabel={$t('chunks.footerWillBeUsed')}
>
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
</ReplaceDefaultField>
