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
  label={$t('details.useCustomTemplate')}
  {form}
  name="youtube.useCustomTemplate"
  initial={meta.youtube?.useCustomTemplate}
  let:field
  let:value
>
  <FkCheckBoxInput {field} />

  <div>
    {#if !value}
      {#if blog.config.youtube?.template}
        <p>{$t('chunks.footerWillBeUsed')}:</p>
        <CodeBlock>{blog.config.youtube?.template}</CodeBlock>
      {:else}
        <p>{$t('chunks.noTemplate')}</p>
      {/if}
    {/if}
  </div>

  <div hidden={!value} class="mt-3">
    <FormRow
      label={$t('details.template')}
      {form}
      name="youtube.template"
      initial={meta.youtube?.template}
      let:field
    >
      <FkTextArea {field} />
    </FormRow>
  </div>
</FormRow>

<FormRow
  label={$t('details.useCustomFooter')}
  {form}
  name="youtube.useCustomFooter"
  initial={meta.youtube?.useCustomFooter}
  let:field
  let:value
>
  <FkCheckBoxInput {field} />

  <div>
    {#if !value}
      {#if blog.config.youtube?.footer}
        <p>{$t('chunks.footerWillBeUsed')}:</p>
        <CodeBlock>{blog.config.youtube?.footer}</CodeBlock>
      {:else}
        <p>{$t('chunks.noFooter')}</p>
      {/if}
    {/if}
  </div>

  <div hidden={!value} class="mt-3">
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
  </div>

</FormRow>
