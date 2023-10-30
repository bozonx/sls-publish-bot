<script>
import { page } from '$app/stores'
import {t} from '$lib/store/t'
import MenuWrapper from '$lib/components/MenuWrapper.svelte'
import MenuItem from '$lib/components/MenuItem.svelte'
</script>


<MenuWrapper>
  <li>
    <MenuItem>{$t('menu.viewText')}</MenuItem>
  </li>
  <li>
    <MenuItem>{$t('menu.changeDate')}</MenuItem>
  </li>
  <li>
    <MenuItem>{$t('menu.changeTime')}</MenuItem>
  </li>
  <li>
    <MenuItem>{$t('menu.changeSN')}</MenuItem>
  </li>
  <li>
    <MenuItem>{$t('menu.changeTags')}</MenuItem>
  </li>
  <li>
    <MenuItem href="/app/{$page.params.blog}/publicate/post/confirm?item={$page.url.searchParams.get('item')}">{$t('menu.next')}</MenuItem>
  </li>
</MenuWrapper>
