<script>
import {Heading} from 'flowbite-svelte'
import {t} from '$lib/store/t'
import MenuWrapper from '$lib/components/MenuWrapper.svelte'
import MenuItem from '$lib/components/MenuItem.svelte'
import {page} from "$app/stores";


export let postResp
</script>

<div>
  <Heading tag="h4">{$t('links.selectPost')}</Heading>
</div>

<MenuWrapper>
  {#each postResp.result as item}
    <li>
      <MenuItem href="/app/{$page.params.blog}/publicate/post?item={item.meta.fileName}">
        {item.meta.title}
      </MenuItem>
    </li>
  {/each}
</MenuWrapper>
