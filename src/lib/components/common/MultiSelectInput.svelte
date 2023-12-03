<script>
import {MultiSelect, Select} from 'flowbite-svelte';
import { createEventDispatcher } from 'svelte'
import { arrayDifference } from 'squidlet-lib'

const dispatch = createEventDispatcher()

export let selected
export let placeholder = ''

export let disabled
export let items

const onChange = ({detail}) => {
  selected = detail.map((el) => el.value)

  dispatch('select', selected)
}
</script>

<MultiSelect
  {items}
  on:change={onChange}
  on:focus
  on:blur
  {placeholder}
  {disabled}
/>
