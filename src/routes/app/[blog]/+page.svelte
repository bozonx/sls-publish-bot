<script>
import { page } from '$app/stores'
import {t} from '$lib/store/t'
import MenuItem from '$lib/components/MenuItem.svelte'
import MenuWrapper from '$lib/components/MenuWrapper.svelte'
import {breadcrumbs} from '$lib/store/breadcrumbs'
import BlogDetails from "$lib/components/BlogDetails.svelte";


export let data

breadcrumbs.set([{title: data.blog.title}])
</script>

<div>
  <BlogDetails item={data.blog} class="mb-8" />

  <MenuWrapper>
    <li>
      <MenuItem href="/app/{$page.params.blog}/contentplan">
        {$t('links.contentPlan')}
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
      <MenuItem href="/app/{$page.params.blog}/config">
        {$t('links.blogConfig')}
      </MenuItem>
    </li>
  </MenuWrapper>
</div>
