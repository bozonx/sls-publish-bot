<script>
import MenuItem from '$lib/components/MenuItem.svelte'
import MenuWrapper from '$lib/components/MenuWrapper.svelte'
import {t} from '$lib/store/t'

export let items
</script>

<MenuWrapper>
  {#each items.result as item}
    <li>
      <MenuItem href="/app/{item.name}">{item.title}</MenuItem>
    </li>
  {/each}
</MenuWrapper>
