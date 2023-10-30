<script>
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import BlogDetails from '$lib/components/BlogDetails.svelte'
import PostDetails from '$lib/components/PostDetails.svelte'
import ConfirmMenu from '$lib/components/ConfirmMenu.svelte'
import SectionHeader from '$lib/components/SectionHeader.svelte'
import {breadcrumbs} from '$lib/store/breadcrumbs'


export let data

breadcrumbs.set([
  {href: `/app/${$page.params.blog}`, title: data.blog.title},
  {href: `/app/${$page.params.blog}/publicate`, title: $t('links.publicate')},
  {href: `/app/${$page.params.blog}/publicate/post?item=${$page.url.searchParams.get('item')}`, title: data.post.result.meta.title},
  {title: $t('headers.confirm')},
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
    <ConfirmMenu />
  </div>

</div>
