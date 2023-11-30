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

let configTmpl
let configFooter

$: {
  configTmpl = (meta.type === POST_TYPES.article)
    ? blog.config.dzen.articleTemplate
    : blog.config.dzen.postTemplate
  configFooter = (meta.type === POST_TYPES.article)
    ? blog.config.dzen.articleFooter
    : blog.config.dzen.postFooter
}
</script>

<FormRow
  label={$t('details.pubDateTime')}
  {form}
  name="dzen.pubDateTime"
  initial={meta.dzen?.pubDateTime}
  let:field
>
  <FkTextInput {field} />
</FormRow>

<FormRow
  label={$t('details.useCustomTemplate')}
  {form}
  name="dzen.useCustomTemplate"
  initial={meta.dzen?.useCustomTemplate}
  let:field
  let:value
>
  <FkCheckBoxInput {field} />

  <div>
    {#if !value}
      {#if configTmpl}
        <p>{$t('chunks.templateWillBeUsed')}:</p>
        <CodeBlock>{configTmpl}</CodeBlock>
      {:else}
        <p>{$t('chunks.noTemplate')}</p>
      {/if}
    {/if}
  </div>

  <div hidden={!value} class="mt-3">
    <FormRow
      label={$t('details.template')}
      {form}
      name="dzen.template"
      initial={meta.dzen?.template}
      let:field
    >
      <FkTextArea {field} />
    </FormRow>
  </div>
</FormRow>

<FormRow
  label={$t('details.useCustomFooter')}
  {form}
  name="dzen.useCustomFooter"
  initial={meta.dzen?.useCustomFooter}
  let:field
  let:value
>
  <FkCheckBoxInput {field} />

  <div>
    {#if !value}
      {#if configFooter}
        <p>{$t('chunks.footerWillBeUsed')}:</p>
        <CodeBlock>{configFooter}</CodeBlock>
      {:else}
        <p>{$t('chunks.noFooter')}</p>
      {/if}
    {/if}
  </div>

  <div hidden={!value} class="mt-3">
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
  </div>
</FormRow>