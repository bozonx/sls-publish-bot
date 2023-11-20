<script>
import { Select } from 'flowbite-svelte'
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

export let selected
export let placeholder = ''

export let disabled
export let items

const handleChange = (event) => {
  dispatch('select', event.target.value)
}
</script>

<Select
  {items}
  bind:value={selected}
  on:change={handleChange}
  on:focus
  on:blur
  {placeholder}
  {disabled}
/>
