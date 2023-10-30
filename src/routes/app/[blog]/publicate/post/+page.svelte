<script>
import {Heading} from 'flowbite-svelte'
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import BlogDetails from '$lib/components/BlogDetails.svelte'
import PostDetails from '$lib/components/PostDetails.svelte'
import PublicationMenu from '$lib/components/PublicationMenu.svelte'
import {breadcrumbs} from '$lib/store/breadcrumbs'


breadcrumbs.set([
  {href: `/app/${$page.params.blog}`, title: $page.params.blog},
  {href: `/app/${$page.params.blog}/publicate`, title: 'publicate'},
  {title: 'post'},
])

export let data
</script>

<Heading tag="h1">{data.post.result.meta.title}</Heading>

<div>
  <div>
    <Heading tag="h4">{$t('chunks.blog')}</Heading>

    <BlogDetails item={data.blog} />
  </div>

  <div>
    <Heading tag="h4">{$t('headers.postDetails')}</Heading>

    <PostDetails item={data.post} />
  </div>

  <div>
    <PublicationMenu />
  </div>

</div>
