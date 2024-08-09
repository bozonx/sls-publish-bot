<script>
import { page } from '$app/stores'
import {t} from '$lib/store/t'
import MenuWrapper from '$lib/components/MenuWrapper.svelte'
import MenuItem from '$lib/components/MenuItem.svelte'

</script>

<MenuWrapper>
  <li>
    <MenuItem href="/app/config">{$t('links.appConfig')}</MenuItem>
  </li>
  <li>
    <MenuItem href="/app/create-blog">{$t('links.createBlog')}</MenuItem>
  </li>
</MenuWrapper>
