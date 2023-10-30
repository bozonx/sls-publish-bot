<script>
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import BlogDetails from '$lib/components/BlogDetails.svelte'
import SelectPost from '$lib/components/SelectPost.svelte'
import SectionHeader from '$lib/components/SectionHeader.svelte'
import {breadcrumbs} from '$lib/store/breadcrumbs'
import {Heading} from "flowbite-svelte";


export let data


breadcrumbs.set([
  {href: `/app/${$page.params.blog}`, title: data.blog.title},
  {title: $t('links.publicate')}
])
</script>

<div>
  <BlogDetails item={data.blog} />

  <div>
    <SectionHeader>{$t('links.selectPost')}</SectionHeader>

    <SelectPost postResp={data.postResp} />
  </div>
</div>
