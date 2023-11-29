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
  label={$t('details.preview')}
  {form}
  name="telegram.preview"
  initial={meta.telegram?.preview}
  let:field
>
  <FkCheckBoxInput {field} />
</FormRow>
<FormRow
  label={$t('details.urlButton')}
  {form}
  name="telegram.urlButton"
  initial={meta.telegram?.urlButton}
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

<FormRow
  label={$t('details.tags')}
  {form}
  name="telegram.tags"
  initial={meta.telegram?.tags}
  let:field
>
  <FkTextInput {field} />
</FormRow>

{#if meta.type === POST_TYPES.article}
  <FormRow
    label={$t('details.articleTemplate')}
    {form}
    name="telegram.articleTemplate"
    initial={meta.telegram?.articleTemplate}
    let:field
  >
    <FkTextArea {field} />
  </FormRow>
{:else}
  <FormRow
    label={$t('details.postTemplate')}
    {form}
    name="telegram.postTemplate"
    initial={meta.telegram?.postTemplate}
    let:field
  >
    <FkTextArea {field} />
  </FormRow>
{/if}
{#if meta.type === POST_TYPES.article}
  <FormRow
    label={$t('details.articleFooter')}
    {form}
    name="telegram.articleFooter"
    initial={meta.telegram?.articleFooter}
    let:field
  >
    <FkTextArea {field} />
  </FormRow>
{:else}
  <FormRow
    label={$t('details.postFooter')}
    {form}
    name="telegram.postFooter"
    initial={meta.telegram?.postFooter}
    let:field
  >
    <FkTextArea {field} />
  </FormRow>
{/if}

<FormRow
  label={$t('details.contentLinks')}
  {form}
  name="telegram.contentLinks"
  initial={meta.telegram?.contentLinks}
  let:field
>
  <FkTextArea {field} />
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
