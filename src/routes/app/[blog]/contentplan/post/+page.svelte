<script>
import { arraySimilar } from 'squidlet-lib'
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import PostDetails from '$lib/components/PostDetails.svelte'
import SectionHeader from '$lib/components/SectionHeader.svelte'
import {breadcrumbs} from '$lib/store/breadcrumbs'
import MenuWrapper from "$lib/components/MenuWrapper.svelte";
import MenuItem from "$lib/components/MenuItem.svelte";
import SelectSns from "$lib/components/SelectSns.svelte";
import FkForm from "$lib/components/common/FkForm.svelte";
import FkCheckBoxInput from "$lib/components/common/FkCheckBoxInput.svelte"
import {ALL_SNS, POST_TYPES} from '$lib/constants'
import {pushToast} from "$lib/store/toasts";
import {squidletAppApi} from "$lib/squidletAppApi";
import {goto} from "$app/navigation";
import {Button, Modal} from "flowbite-svelte";
import FkTextInput from "$lib/components/common/FkTextInput.svelte";


export let data

const meta = data.post.result.meta
let allAllowedSns = arraySimilar(meta.sns, Object.keys(ALL_SNS))
let publishSns = allAllowedSns
let toArchiveModalOpen = false

breadcrumbs.set([
  {href: `/app/${$page.params.blog}`, title: data.blog.title},
  {href: `/app/${$page.params.blog}/contentplan`, title: $t('links.contentPlan')},
  {title: meta.title || meta.postId},
])

const onSelectSnsChange = async ({detail}) => {
  publishSns = detail
}

const onMoveToArchive = () => {
  (async () => {
    await squidletAppApi.moveContentPlanPostToArchive($page.params.blog, meta.postId)

    goto(`/app/${$page.params.blog}/archive/post?postid=${meta.postId}`)
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
        <MenuItem
          href="/app/{$page.params.blog}/contentplan/edit?postid={meta.postId}"
        >{$t('menu.edit')}</MenuItem>
      </li>
      <li>
        <MenuItem href="" on:click={() => toArchiveModalOpen = true}>{$t('menu.toArchive')}</MenuItem>
        <Modal title={$t('menu.toArchive')} bind:open={toArchiveModalOpen}>
          {$t('messages.reallyMoveToArchive')}
          <svelte:fragment slot="footer">
            <div class="w-full text-right">
              <Button color="alternative" on:click={() => (toArchiveModalOpen = false)}>{$t('chunks.cancel')}</Button>
              <Button on:click={onMoveToArchive}>{$t('chunks.move')}</Button>
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

  <div class="mt-7">
    <SectionHeader>{$t('headers.preview')}</SectionHeader>

    <MenuWrapper>
      {#if meta.type === POST_TYPES.article}
        <li>
          <MenuItem
            href="/app/{$page.params.blog}/contentplan/post/preview-article?postid={meta.postId}"
          >{$t('menu.previewArticle')}</MenuItem>
        </li>
      {:else}
        <li>
          <MenuItem
            href="/app/{$page.params.blog}/contentplan/post/preview-post?postid={meta.postId}"
          >{$t('menu.previewPost')}</MenuItem>
        </li>
      {/if}
      {#if meta.sns?.includes(ALL_SNS.telegram)}
        <li>
          <MenuItem>!!! {$t('menu.previewTgPost')}</MenuItem>
        </li>
      {/if}
      {#if meta.sns?.includes(ALL_SNS.dzen)}
        <li>
          <MenuItem
            href="/app/{$page.params.blog}/contentplan/post/fordzen?postid={meta.postId}"
          >{$t('menu.previewZen')}</MenuItem>
        </li>
      {/if}
      {#if meta.sns?.includes(ALL_SNS.youtube)}
        <li>
          <MenuItem
            href="/app/{$page.params.blog}/contentplan/post/foryoutube?postid={meta.postId}"
          >{$t('menu.previewYoutube')}</MenuItem>
        </li>
      {/if}
      {#if meta.sns?.includes(ALL_SNS.podcast)}
        <li>
          <MenuItem
            href="/app/{$page.params.blog}/contentplan/post/forpodcast?postid={meta.postId}"
          >{$t('menu.previewPodcast')}</MenuItem>
        </li>
      {/if}
    </MenuWrapper>
  </div>

  <div class="mt-7">
    <SectionHeader>{$t('headers.publish')}</SectionHeader>

    <SelectSns class="mb-3" allowedSns={allAllowedSns} on:change={onSelectSnsChange} />

    <MenuWrapper>
      {#if publishSns.length}
        <li>
          <MenuItem>
            <span>!!! {$t('menu.publishAll')} </span>
            ({publishSns.map(item => $t(`sns.${item}`)).join(', ')})
          </MenuItem>
        </li>
      {/if}

      {#if meta.sns?.includes(ALL_SNS.telegram)}
        {#if meta.type === POST_TYPES.article}
          <li>
            <MenuItem>!!! {$t('menu.publishOnlyTelegraph')}</MenuItem>
          </li>
        {/if}
        <li>
          <MenuItem>!!! {$t('menu.publishOnlyTelegram')}</MenuItem>
        </li>
      {/if}
      {#if meta.sns?.includes(ALL_SNS.site)}
        <li>
          <MenuItem>!!! {$t('menu.publishOnlySite')}</MenuItem>
        </li>
      {/if}
      {#if meta.sns?.includes(ALL_SNS.youtube)}
        <li>
          <MenuItem>!!! {$t('menu.publishOnlyYoutube')}</MenuItem>
        </li>
      {/if}
    </MenuWrapper>
  </div>

</div>
