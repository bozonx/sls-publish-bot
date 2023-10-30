<script>
import {Heading} from 'flowbite-svelte'
import {t} from '$lib/store/t'
import SelectPostItem from '$lib/components/SelectPostItem.svelte'


export let postResp
</script>

<div>
  <Heading tag="h4">{$t('links.selectPost')}</Heading>
</div>

<ul>
  {#each postResp.result as item}
    <SelectPostItem {item} />
  {/each}
</ul>
