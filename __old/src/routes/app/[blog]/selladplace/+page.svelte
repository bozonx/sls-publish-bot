<script>
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import SectionHeader from '$lib/components/SectionHeader.svelte'
import {breadcrumbs} from '$lib/store/breadcrumbs'


export let data


breadcrumbs.set([
  {href: `/app/${$page.params.blog}`, title: data.blog.title},
  {title: $t('links.sellAdPlace')}
])
</script>

<div>
  <div>
    <SectionHeader>{$t('links.sellAdPlace')}</SectionHeader>


  </div>
</div>
