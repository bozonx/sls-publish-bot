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
      <MenuItem href="/app/{$page.params.blog}/create">
        {$t('links.createPost')}
      </MenuItem>
      <MenuItem href="/app/{$page.params.blog}/contentplan">
        {$t('links.viewContentPlan')}
      </MenuItem>
      <MenuItem href="/app/{$page.params.blog}/publicate">
        {$t('links.publicate')}
      </MenuItem>
      <MenuItem href="/app/{$page.params.blog}/buyad">
        {$t('links.buyAd')}
      </MenuItem>
      <MenuItem href="/app/{$page.params.blog}/selladplace">
        {$t('links.sellAdPlace')}
      </MenuItem>
      <MenuItem href="/app/{$page.params.blog}/telegraph">
        {$t('links.telegraphCrtl')}
      </MenuItem>
      <MenuItem>
        {$t('links.tasksCrtl')}
      </MenuItem>
      <MenuItem href="/app/{$page.params.blog}/archive">
        {$t('links.archiveView')}
      </MenuItem>
    </li>
  </MenuWrapper>
</div>
