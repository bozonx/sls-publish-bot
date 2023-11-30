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

<ReplaceDefaultField
  label={$t('details.useCustomPubDate')}
  {form}
  name="dzen.useCustomPubDate"
  initial={meta.dzen?.useCustomPubDate}
>
  <FormRow
    label={$t('details.pubDateTime')}
    {form}
    name="dzen.pubDateTime"
    initial={meta.dzen?.pubDateTime}
    let:field
  >
    <FkTextInput {field} />
  </FormRow>
</ReplaceDefaultField>

<ReplaceDefaultField
  label={$t('details.useCustomTemplate')}
  {form}
  name="dzen.useCustomTemplate"
  initial={meta.dzen?.useCustomTemplate}
  defaultValue={(meta.type === POST_TYPES.article)
    ? blog.config.dzen.articleTemplate
    : blog.config.dzen.postTemplate}
  defaultValueLabel={$t('chunks.templateWillBeUsed')}
>
  <FormRow
    label={$t('details.template')}
    {form}
    name="dzen.template"
    initial={meta.dzen?.template}
    let:field
  >
    <FkTextArea {field} />
  </FormRow>
</ReplaceDefaultField>

<ReplaceDefaultField
  label={$t('details.useCustomFooter')}
  {form}
  name="dzen.useCustomFooter"
  initial={meta.dzen?.useCustomFooter}
  defaultValue={(meta.type === POST_TYPES.article)
    ? blog.config.dzen.articleFooter
    : blog.config.dzen.postFooter}
  defaultValueLabel={$t('chunks.footerWillBeUsed')}
>
  <FormRow
    label={$t('details.footer')}
    {form}
    name="dzen.footer"
    initial={meta.dzen?.footer}
    let:field
    hint={$t('hints.footerField')}
  >
    <FkTextArea {field} />
  </FormRow>
</ReplaceDefaultField>
