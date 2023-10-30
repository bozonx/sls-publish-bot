<script>
import {t} from '$lib/store/t'
import AllBlogs from '$lib/components/AllBlogs.svelte'
import MainMenu from '$lib/components/MainMenu.svelte'
import SectionHeader from '$lib/components/SectionHeader.svelte'
import {breadcrumbs} from '$lib/store/breadcrumbs'


breadcrumbs.set([])
export let data
</script>

<div>
  <div>
    <SectionHeader>{$t('headers.allBlogs')}</SectionHeader>
    <AllBlogs items={data.allBlogs} />
  </div>

  <div class="mt-5">
    <SectionHeader>{$t('headers.menu')}</SectionHeader>
    <MainMenu />
  </div>
</div>
