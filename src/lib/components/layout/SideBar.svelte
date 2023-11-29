<script>
import MenuWrapper from "$lib/components/MenuWrapper.svelte";
import {t} from "$lib/store/t";
import MenuItem from "$lib/components/MenuItem.svelte"
import AllBlogs from "$lib/components/AllBlogs.svelte"


export let allBlogs
</script>


<div>
  <MenuWrapper class="mb-0.5">
    <li>
      <MenuItem href="/app">{$t('links.home')}</MenuItem>
    </li>
  </MenuWrapper>

  <AllBlogs items={allBlogs} />
</div>
