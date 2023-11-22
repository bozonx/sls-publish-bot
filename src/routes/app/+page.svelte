<script>
import {t} from '$lib/store/t'
import AllBlogs from '$lib/components/AllBlogs.svelte'
import MainMenu from '$lib/components/MainMenu.svelte'
import SectionHeader from '$lib/components/SectionHeader.svelte'
import {breadcrumbs} from '$lib/store/breadcrumbs'
import MenuItem from "$lib/components/MenuItem.svelte";
import MenuWrapper from "$lib/components/MenuWrapper.svelte";
import {squidletAppApi} from "$lib/squidletAppApi";
import {page} from "$app/stores";
import {goto} from "$app/navigation";
import {pushToast} from "$lib/store/toasts"


breadcrumbs.set([])
export let data


</script>

<div>

  <MenuWrapper>

  </MenuWrapper>

  <div>
    <SectionHeader>{$t('headers.allBlogs')}</SectionHeader>
    <AllBlogs items={data.allBlogs} />
  </div>

  <div class="mt-5">
    <SectionHeader>{$t('headers.menu')}</SectionHeader>
    <MainMenu />
  </div>
</div>
