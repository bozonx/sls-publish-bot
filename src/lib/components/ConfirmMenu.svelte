<script>
  import { page } from '$app/stores'
  import {t} from '$lib/store/t'
  import MenuWrapper from '$lib/components/MenuWrapper.svelte'
  import MenuItem from '$lib/components/MenuItem.svelte'
</script>


<MenuWrapper>
  <li>
    <MenuItem>{$t('menu.viewZen')}</MenuItem>
  </li>
  <li>
    <MenuItem>{$t('menu.publishOnlyTelegraph')}</MenuItem>
  </li>
  <li>
    <MenuItem>{$t('menu.publishAll')}</MenuItem>
  </li>
</MenuWrapper>
