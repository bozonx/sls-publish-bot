<script>
import {Heading} from 'flowbite-svelte'
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import BlogDetails from '$lib/components/BlogDetails.svelte'
import PostDetails from '$lib/components/PostDetails.svelte'
import ConfirmMenu from '$lib/components/ConfirmMenu.svelte'

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
