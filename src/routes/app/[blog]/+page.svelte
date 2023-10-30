<script>
import { page } from '$app/stores'
import {t} from '$lib/store/t'
import MenuItem from '$lib/components/MenuItem.svelte'
</script>

<div>
  blog {$page.params.blog} menu

  <nav>
    <li>
      <MenuItem href="/app/{$page.params.blog}/publicate">
        {$t('links.publicate')}
      </MenuItem>
    </li>
  </nav>
</div>
