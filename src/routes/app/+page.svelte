<script>
import {t} from '$lib/store/t'
import {getContext} from "svelte";
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
import {ALL_BLOGS_CONTEXT} from "$lib/constants";


breadcrumbs.set([])

const allBlogs = getContext(ALL_BLOGS_CONTEXT)

</script>

<div>
  <div>
    <SectionHeader>{$t('headers.allBlogs')}</SectionHeader>
    <AllBlogs items={allBlogs} />
  </div>

  <div class="mt-5">
    <SectionHeader>{$t('headers.menu')}</SectionHeader>
    <MainMenu />
  </div>
</div>
