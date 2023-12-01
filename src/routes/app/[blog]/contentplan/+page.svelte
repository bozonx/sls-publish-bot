<script>
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import {goto} from '$app/navigation';
import SelectPost from '$lib/components/SelectPost.svelte'
import SectionHeader from '$lib/components/SectionHeader.svelte'
import {breadcrumbs} from '$lib/store/breadcrumbs'
import MenuWrapper from "$lib/components/MenuWrapper.svelte"
import MenuItem from "$lib/components/MenuItem.svelte"
import {squidletAppApi} from "$lib/squidletAppApi"
import {pushToast} from "$lib/store/toasts"
import {TO_PUBLISH_DIR} from '$lib/constants'


export let data


breadcrumbs.set([
  {href: `/app/${$page.params.blog}`, title: data.blog.title},
  {title: $t('links.contentPlan')}
])

const handleCreate = () => {
  (async () => {
    const pageId = await squidletAppApi.createToPublishPost($page.params.blog)

    goto(`/app/${$page.params.blog}/contentplan/edit?postid=${pageId}`)
  })()
    .catch((e) => pushToast({
      text: `Can't save: ${e}`,
      purpose: 'error'
    }))
}
</script>

<div>

  <MenuWrapper>
    <li>
      <MenuItem on:click={handleCreate} href="">
        {$t('links.createRecord')}
      </MenuItem>
    </li>
  </MenuWrapper>

  <div>
    <SectionHeader>{$t('links.selectPost')}</SectionHeader>

    <SelectPost postResp={data.postResp} dir={TO_PUBLISH_DIR} />
  </div>

</div>
