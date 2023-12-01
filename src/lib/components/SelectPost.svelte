<script>
import {Heading} from 'flowbite-svelte'
import {t} from '$lib/store/t'
import MenuWrapper from '$lib/components/MenuWrapper.svelte'
import MenuItem from '$lib/components/MenuItem.svelte'
import {page} from "$app/stores";


export let dir
export let postResp
</script>

<MenuWrapper>
  {#each postResp.result as item}
    <li>
      <MenuItem href="/app/{$page.params.blog}/{dir}/post?postid={item.meta.postId}">
        {item.meta.title || item.meta.postId}
      </MenuItem>
    </li>
  {/each}
</MenuWrapper>
