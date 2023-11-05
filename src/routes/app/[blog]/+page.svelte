<script>
import { page } from '$app/stores'
import {t} from '$lib/store/t'
import MenuItem from '$lib/components/MenuItem.svelte'
import MenuWrapper from '$lib/components/MenuWrapper.svelte'
import {breadcrumbs} from '$lib/store/breadcrumbs'


export let data

breadcrumbs.set([{title: data.blog.title}])
</script>

<div>
  <MenuWrapper>
    <li>
      <MenuItem href="/app/{$page.params.blog}/publicate">
        {$t('links.publicate')}
      </MenuItem>
      <MenuItem href="/app/{$page.params.blog}/telegraph">
        {$t('links.telegraphCrtl')}
      </MenuItem>
    </li>
  </MenuWrapper>
</div>
