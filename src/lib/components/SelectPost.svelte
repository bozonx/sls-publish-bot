<script>
import {Heading} from 'flowbite-svelte'
import {t} from '$lib/store/t'
import MenuWrapper from '$lib/components/MenuWrapper.svelte'
import MenuItem from '$lib/components/MenuItem.svelte'
import {page} from "$app/stores";


export let postResp
</script>

<MenuWrapper>
  {#each postResp.result as item}
    <li>
      <MenuItem href="/app/{$page.params.blog}/contentplan/post?item={item.meta.postId}">
        {item.meta.title}
      </MenuItem>
    </li>
  {/each}
</MenuWrapper>
