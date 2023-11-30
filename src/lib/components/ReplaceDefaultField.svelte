<script>
import {t} from "$lib/store/t";
import FormRow from "$lib/components/common/FormRow.svelte";
import FkCheckBoxInput from "$lib/components/common/FkCheckBoxInput.svelte";
import CodeBlock from "$lib/components/common/CodeBlock.svelte";
import FkTextArea from "$lib/components/common/FkTextArea.svelte";


export let name
export let form
export let label
export let initial
export let defaultValue = undefined
export let defaultValueLabel
</script>

<FormRow
  {label}
  {form}
  {name}
  {initial}
  let:field
  let:value
>
  <FkCheckBoxInput {field} />

  {#if !value}
    <div>
    {#if defaultValue}
      <p>{defaultValueLabel}</p>
      <CodeBlock>{defaultValue}</CodeBlock>
    {:else}
      <p>{$t('chunks.empty')}</p>
    {/if}
    </div>
  {/if}

  <div hidden={!value} class="mt-3">
    <slot />
  </div>
</FormRow>
