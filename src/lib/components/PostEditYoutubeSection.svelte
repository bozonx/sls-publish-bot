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
import CodeBlock from "$lib/components/common/CodeBlock.svelte";
import ReplaceDefaultField from "$lib/components/ReplaceDefaultField.svelte";


export let meta
export let blog
export let form

</script>

<FormRow
  label={$t('details.pubDateTime')}
  {form}
  name="youtube.pubDateTime"
  initial={meta.youtube?.pubDateTime}
  let:field
>
  <FkTextInput {field} />
</FormRow>

<FormRow
  label={$t('details.tags')}
  {form}
  name="youtube.tags"
  initial={meta.youtube?.tags}
  let:field
>
  <FkTextInput {field} />
</FormRow>

<ReplaceDefaultField
  label={$t('details.useCustomLinks')}
  {form}
  name="youtube.useCustomLinks"
  initial={meta.youtube?.useCustomLinks}
>
  <FormRow
    label={$t('details.contentLinks')}
    {form}
    name="youtube.contentLinks"
    initial={meta.youtube?.contentLinks}
    let:field
  >
    <FkTextArea {field} />
  </FormRow>
</ReplaceDefaultField>

<ReplaceDefaultField
  label={$t('details.useCustomTemplate')}
  {form}
  name="youtube.useCustomTemplate"
  initial={meta.youtube?.useCustomTemplate}
  defaultValue={blog.config.youtube?.template}
  defaultValueLabel={$t('chunks.templateWillBeUsed')}
>
  <FormRow
    label={$t('details.template')}
    {form}
    name="youtube.template"
    initial={meta.youtube?.template}
    let:field
  >
    <FkTextArea {field} />
  </FormRow>
</ReplaceDefaultField>

<ReplaceDefaultField
  label={$t('details.useCustomFooter')}
  {form}
  name="youtube.useCustomFooter"
  initial={meta.youtube?.useCustomFooter}
  defaultValue={blog.config.youtube?.footer}
  defaultValueLabel={$t('chunks.footerWillBeUsed')}
>
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
</ReplaceDefaultField>
