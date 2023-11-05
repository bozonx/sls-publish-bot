<script>
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import SectionHeader from '$lib/components/SectionHeader.svelte'
import BlogConfigForm from '$lib/components/BlogConfigForm.svelte'
import {breadcrumbs} from '$lib/store/breadcrumbs'


export let data


breadcrumbs.set([
  {href: `/app/${$page.params.blog}`, title: data.blog.title},
  {title: $t('links.blogConfig')}
])
</script>

<div>
  <div>
    <SectionHeader>{$t('links.blogConfig')}</SectionHeader>

    <BlogConfigForm config={data.blog.config} />
  </div>
</div>
