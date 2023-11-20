<script>
  import {MultiSelect, Select} from 'flowbite-svelte';
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

export let selected
export let placeholder = ''

export let disabled
export let items

console.log(222, selected)

const handleChange = (event) => {
  console.log(111, event)

  //dispatch('select', event.target.value)
}

/*
  bind:value={selected}
  on:change={handleChange}
  on:input={handleChange}
 */
</script>

<MultiSelect
  {items}

  on:focus
  on:blur
  {placeholder}
  {disabled}
/>
