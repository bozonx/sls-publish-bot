<script>
import { page } from '$app/stores'
import {t} from '$lib/store/t'
import MenuItem from '$lib/components/MenuItem.svelte'
import MenuWrapper from '$lib/components/MenuWrapper.svelte'
</script>

<div>
  blog {$page.params.blog} menu

  <MenuWrapper>
    <li>
      <MenuItem href="/app/{$page.params.blog}/publicate">
        {$t('links.publicate')}
      </MenuItem>
    </li>
  </MenuWrapper>
</div>
