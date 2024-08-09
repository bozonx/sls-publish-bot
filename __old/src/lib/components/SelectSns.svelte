<script>
import {Checkbox} from 'flowbite-svelte'
import { createEventDispatcher } from 'svelte'
import {t} from "$lib/store/t"
import {ALL_SNS} from '$lib/constants'
let className = ''


const dispatch = createEventDispatcher()


export { className as class }
export let allowedSns = Object.keys(ALL_SNS)
export let initialChecked = allowedSns

let selected = {}

for (const sn of allowedSns) {
  selected[sn] = initialChecked.includes(sn)
}


const onChange = (sn, event) => {
  selected[sn] = event.target.checked

  const items = Object.keys(selected)
    .filter((item) => selected[item])

  dispatch('change', items)
}
</script>


<div class="{className}">
  {#each allowedSns as sn}
    <Checkbox checked={selected[sn]} on:change={(event) => onChange(sn, event)}>
      {$t(`sns.${sn}`)}
    </Checkbox>
  {/each}
</div>
