<script>
import { Badge, Input } from 'flowbite-svelte'
import {spliceItem} from 'squidlet-lib'
import {t} from '$lib/store/t'
import FieldMsg from "$lib/components/common/FieldMsg.svelte"


export let field

// TODO: надо поменять она value - убрать immutable
let selectedTags = [...(field.editedValue || [])]
let inputValue = ''
let invalidMessage = null

const onKeyPress = (event) => {
  if (event.code !== 'Enter') return
  else if (!event.target.value) return
  else if (invalidMessage) return

  selectedTags[selectedTags.length] = event.target.value
  inputValue = ''
  field.handleChange(selectedTags)
}

const onChange = (event) => {
  if ((event.target.value || '').match(/\#/)) {
    invalidMessage = $t('messages.wrongSymbols')

    return
  }
  else {
    invalidMessage = null
  }
}

const onClose = (tag) => {
  spliceItem(selectedTags, tag)
  field.handleChange(selectedTags)
}

</script>

<div>
  <Input
    bind:value={inputValue}
    on:keyup={onChange}
    on:keypress={onKeyPress}
    placeholder={$t('placeholders.tagsInput')}
    color={(invalidMessage) ? 'red' : 'base'}
  />

  {#if invalidMessage}
    <FieldMsg error>{invalidMessage}</FieldMsg>
  {/if}

  <div class="space-x-1 mt-2">
    {#each selectedTags as tag}
      {#key tag}
        <Badge dismissable large color="dark" on:close={() => onClose(tag)}>{tag}</Badge>
      {/key}
    {/each}
  </div>

</div>
