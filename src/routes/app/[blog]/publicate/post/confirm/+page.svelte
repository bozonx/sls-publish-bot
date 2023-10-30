<script>
import {Heading} from 'flowbite-svelte'
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import BlogDetails from '$lib/components/BlogDetails.svelte'
import PostDetails from '$lib/components/PostDetails.svelte'
import ConfirmMenu from '$lib/components/ConfirmMenu.svelte'
import {breadcrumbs} from '$lib/store/breadcrumbs'


breadcrumbs.set([
  {href: `/app/${$page.params.blog}`, title: $page.params.blog},
  {href: `/app/${$page.params.blog}/publicate`, title: 'publicate'},
  {href: `/app/${$page.params.blog}/publicate/post?item=${$page.url.searchParams.get('item')}`, title: 'post'},
  {title: 'confirm'},
])

export let data
</script>

<Heading tag="h1">{$t('headers.confirm')}</Heading>

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
    <ConfirmMenu />
  </div>

</div>
