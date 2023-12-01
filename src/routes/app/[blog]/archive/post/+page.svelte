<script>
import { arraySimilar } from 'squidlet-lib'
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import PostDetails from '$lib/components/PostDetails.svelte'
import SectionHeader from '$lib/components/SectionHeader.svelte'
import {breadcrumbs} from '$lib/store/breadcrumbs'
import MenuWrapper from "$lib/components/MenuWrapper.svelte";
import MenuItem from "$lib/components/MenuItem.svelte";
import {pushToast} from "$lib/store/toasts";
import {squidletAppApi} from "$lib/squidletAppApi";
import {goto} from "$app/navigation";
import {Button, Modal} from "flowbite-svelte";
import FkTextInput from "$lib/components/common/FkTextInput.svelte";


export let data

const meta = data.post.result.meta
let toContentPlanModalOpen = false

breadcrumbs.set([
  {href: `/app/${$page.params.blog}`, title: data.blog.title},
  {href: `/app/${$page.params.blog}/archive`, title: $t('links.archive')},
  {title: meta.title || meta.postId},
])

const onMoveToContentPlan = () => {
  (async () => {
    await squidletAppApi.moveContentPlanPostToContentPlan($page.params.blog, meta.postId)

    goto(`/app/${$page.params.blog}/contentplan/post?postid=${meta.postId}`)
  })()
    .catch((e) => pushToast({
      text: `Can't save: ${e}`,
      purpose: 'error'
    }))
}

</script>

<div>

  <div class="mt-7">
    <MenuWrapper>
      <li>
        <MenuItem href="" on:click={() => toContentPlanModalOpen = true}>{$t('menu.toContentPlan')}</MenuItem>
        <Modal title={$t('menu.toContentPlan')} bind:open={toContentPlanModalOpen}>
          {$t('messages.reallyMoveToContentPlan')}
          <svelte:fragment slot="footer">
            <div class="w-full text-right">
              <Button color="alternative" on:click={() => (toContentPlanModalOpen = false)}>{$t('chunks.cancel')}</Button>
              <Button on:click={onMoveToContentPlan}>{$t('chunks.move')}</Button>
            </div>
          </svelte:fragment>
        </Modal>
      </li>
    </MenuWrapper>
  </div>

  <div>
    <SectionHeader>{$t('headers.postDetails')}</SectionHeader>

    <PostDetails item={data.post} />
  </div>

</div>
