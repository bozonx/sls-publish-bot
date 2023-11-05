<script>
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import BlogDetails from '$lib/components/BlogDetails.svelte'
import PostDetails from '$lib/components/PostDetails.svelte'
import SectionHeader from '$lib/components/SectionHeader.svelte'
import {breadcrumbs} from '$lib/store/breadcrumbs'
import MenuWrapper from "$lib/components/MenuWrapper.svelte";
import MenuItem from "$lib/components/MenuItem.svelte";


export let data

breadcrumbs.set([
  {href: `/app/${$page.params.blog}`, title: data.blog.title},
  {href: `/app/${$page.params.blog}/contentplan`, title: $t('links.contentPlan')},
  {title: data.post.result.meta.title},
])
</script>

<div>
  <div>
    <SectionHeader>{$t('chunks.blog')}</SectionHeader>

    <BlogDetails item={data.blog} />
  </div>

  <div>
    <SectionHeader>{$t('headers.postDetails')}</SectionHeader>

    <PostDetails item={data.post} />
  </div>

  <div class="mt-7">
    <SectionHeader>{$t('headers.preview')}</SectionHeader>

    <MenuWrapper>
      <li>
        <MenuItem>{$t('menu.previewArticle')}</MenuItem>
      </li>
      <li>
        <MenuItem>{$t('menu.previewPost')}</MenuItem>
      </li>
      <li>
        <MenuItem>{$t('menu.previewTgPost')}</MenuItem>
      </li>
    </MenuWrapper>
  </div>

  <div class="mt-7">
    <SectionHeader>{$t('headers.publish')}</SectionHeader>

    <MenuWrapper>
      <li>
        <MenuItem>{$t('menu.publishZen')}</MenuItem>
      </li>
      <li>
        <MenuItem>{$t('menu.publishOnlyTelegraph')}</MenuItem>
      </li>

      <li>
        <MenuItem>{$t('menu.changeSN')}</MenuItem>
      </li>
      <li>
        <MenuItem>{$t('menu.publishAll')}</MenuItem>
      </li>
    </MenuWrapper>
  </div>

</div>
