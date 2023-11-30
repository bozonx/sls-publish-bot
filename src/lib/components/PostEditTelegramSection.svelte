<script>
import { arraySimilar } from 'squidlet-lib'
import {Button, Modal, Textarea, Checkbox} from 'flowbite-svelte'
import {t} from '$lib/store/t'
import FkTextInput from "$lib/components/common/FkTextInput.svelte"
import FkTextArea from "$lib/components/common/FkTextArea.svelte"
import FkCheckBoxInput from "$lib/components/common/FkCheckBoxInput.svelte"
import CodeBlock from "$lib/components/common/CodeBlock.svelte"
import FormRow from "$lib/components/common/FormRow.svelte"
import {POST_TYPES} from "$lib/constants"
import SectionHeader from "$lib/components/SectionHeader.svelte";
import SelectTags from "$lib/components/SelectTags.svelte";
import ReplaceDefaultField from "$lib/components/ReplaceDefaultField.svelte";


export let meta
export let blog
export let form

let useUrlButton = false
</script>

<FormRow
  label={$t('details.preview')}
  {form}
  name="telegram.preview"
  initial={meta.telegram?.preview}
  let:field
>
  <FkCheckBoxInput {field} />
</FormRow>

<div class="mb-5 mt-7">
  <Checkbox bind:checked={useUrlButton}>{$t('chunks.useUrlButton')}</Checkbox>
</div>

<div hidden={!useUrlButton}>
  <FormRow
    label={$t('details.urlButton') + ' - text'}
    {form}
    name="telegram.urlButton.text"
    initial={meta.telegram?.urlButton?.text}
    let:field
  >
    <FkTextInput {field} />
  </FormRow>

  <FormRow
    label={$t('details.urlButton') + ' - URL'}
    {form}
    name="telegram.urlButton.url"
    initial={meta.telegram?.urlButton?.url}
    let:field
  >
    <FkTextInput {field} />
  </FormRow>
</div>

<FormRow
  label={$t('details.tags')}
  {form}
  name="telegram.tags"
  initial={meta.telegram?.tags}
  let:field
>
  <SelectTags {field} />
</FormRow>

<FormRow
  label={$t('details.pubDateTime')}
  {form}
  name="telegram.pubDateTime"
  initial={meta.telegram?.pubDateTime}
  let:field
>
  <FkTextInput {field} />
</FormRow>

<FormRow
  label={$t('details.autoRemove')}
  {form}
  name="telegram.autoRemove"
  initial={meta.telegram?.autoRemove}
  let:field
>
  <FkTextInput {field} />
</FormRow>

<ReplaceDefaultField
  label={$t('details.useCustomLinks')}
  {form}
  name="telegram.useCustomLinks"
  initial={meta.telegram?.useCustomLinks}
>
  <FormRow
    label={$t('details.contentLinks')}
    {form}
    name="telegram.contentLinks"
    initial={meta.telegram?.contentLinks}
    let:field
  >
    <FkTextArea {field} />
  </FormRow>
</ReplaceDefaultField>

<ReplaceDefaultField
  label={$t('details.useCustomTemplate')}
  {form}
  name="telegram.useCustomTemplate"
  initial={meta.telegram?.useCustomTemplate}
  defaultValue={(meta.type === POST_TYPES.article)
    ? blog.config.telegram.articleTemplate
    : blog.config.telegram.postTemplate}
  defaultValueLabel={$t('chunks.templateWillBeUsed')}
>
  <FormRow
    hidden={meta.type !== POST_TYPES.article}
    label={$t('details.articleTemplate')}
    {form}
    name="telegram.articleTemplate"
    initial={meta.telegram?.articleTemplate}
    let:field
  >
    <FkTextArea {field} />
  </FormRow>
  <FormRow
    hidden={meta.type === POST_TYPES.article}
    label={$t('details.postTemplate')}
    {form}
    name="telegram.postTemplate"
    initial={meta.telegram?.postTemplate}
    let:field
  >
    <FkTextArea {field} />
  </FormRow>
</ReplaceDefaultField>

<ReplaceDefaultField
  label={$t('details.useCustomFooter')}
  {form}
  name="telegram.useCustomFooter"
  initial={meta.telegram?.useCustomFooter}
  defaultValue={(meta.type === POST_TYPES.article)
    ? blog.config.telegram.articleFooter
    : blog.config.telegram.postFooter}
  defaultValueLabel={$t('chunks.footerWillBeUsed')}
>
  <FormRow
    hidden={meta.type !== POST_TYPES.article}
    label={$t('details.articleFooter')}
    {form}
    name="telegram.articleFooter"
    initial={meta.telegram?.articleFooter}
    let:field
    hint={$t('hints.footerField')}
  >
    <FkTextArea {field} />
  </FormRow>
  <FormRow
    hidden={meta.type === POST_TYPES.article}
    label={$t('details.postFooter')}
    {form}
    name="telegram.postFooter"
    initial={meta.telegram?.postFooter}
    let:field
    hint={$t('hints.footerField')}
  >
    <FkTextArea {field} />
  </FormRow>
</ReplaceDefaultField>
