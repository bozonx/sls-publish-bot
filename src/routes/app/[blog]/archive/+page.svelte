<script>
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import SectionHeader from '$lib/components/SectionHeader.svelte'
import {breadcrumbs} from '$lib/store/breadcrumbs'
import SelectPost from "$lib/components/SelectPost.svelte";
import {ARCHIVE_DIR} from '$lib/constants'


export let data


breadcrumbs.set([
  {href: `/app/${$page.params.blog}`, title: data.blog.title},
  {title: $t('links.archiveView')}
])
</script>

<div>

  <div>
    <SectionHeader>{$t('links.selectPost')}</SectionHeader>

    <SelectPost postResp={data.postResp} dir={ARCHIVE_DIR} />
  </div>
</div>
