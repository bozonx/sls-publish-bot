<script>
import { arraySimilar } from 'squidlet-lib'
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import BlogDetails from '$lib/components/BlogDetails.svelte'
import PostDetails from '$lib/components/PostDetails.svelte'
import SectionHeader from '$lib/components/SectionHeader.svelte'
import {breadcrumbs} from '$lib/store/breadcrumbs'
import MenuWrapper from "$lib/components/MenuWrapper.svelte";
import MenuItem from "$lib/components/MenuItem.svelte";
import FkForm from "$lib/components/common/FkForm.svelte";
import FkCheckBoxInput from "$lib/components/common/FkCheckBoxInput.svelte"
import {ALL_SNS, POST_TYPES} from '$lib/constants'


export let data

const meta = data.post.result.meta
let allAllowedSns = arraySimilar(Object.keys(meta), Object.keys(ALL_SNS))
let publishSns = [...allAllowedSns]

breadcrumbs.set([
  {href: `/app/${$page.params.blog}`, title: data.blog.title},
  {href: `/app/${$page.params.blog}/contentplan`, title: $t('links.contentPlan')},
  {title: meta.title || meta.postId},
])

const handleSnSave = async (values) => {
  publishSns = Object.keys(values).filter((key) => values[key])
}
</script>

<div>
  <div>
    <SectionHeader>{$t('chunks.blog')}</SectionHeader>

    <BlogDetails item={data.blog} />
  </div>

  <div>
    <SectionHeader>{$t('headers.postDetails')}</SectionHeader>

    <PostDetails item={data.post} />
  </div>

  <div class="mt-7">
    <MenuWrapper>
      <li>
        <MenuItem
          href="/app/{$page.params.blog}/contentplan/edit?postid={meta.postId}"
        >{$t('menu.edit')}</MenuItem>
      </li>
      <li>
        <MenuItem>{$t('menu.toArchive')}</MenuItem>
      </li>
    </MenuWrapper>
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

      {#if meta.telegram}
        <li>
          <MenuItem>{$t('menu.previewTgPost')}</MenuItem>
        </li>
      {/if}
    </MenuWrapper>
  </div>

  <div class="mt-7">
    <SectionHeader>{$t('headers.publishData')}</SectionHeader>

    <MenuWrapper>
      {#if meta.dzen}
        <li>
          <MenuItem
            href="/app/{$page.params.blog}/contentplan/post/fordzen?postid={meta.postId}"
          >{$t('menu.pubDataZen')}</MenuItem>
        </li>
      {/if}
      {#if meta.podcast}
        <li>
          <MenuItem
            href="/app/{$page.params.blog}/contentplan/post/forpodcast?postid={meta.postId}"
          >{$t('menu.pubDataPodcast')}</MenuItem>
        </li>
      {/if}
      {#if meta.youtube}
        <li>
          <MenuItem
            href="/app/{$page.params.blog}/contentplan/post/foryoutube?postid={meta.postId}"
          >{$t('menu.pubDataYoutube')}</MenuItem>
        </li>
      {/if}
    </MenuWrapper>
  </div>

  <div class="mt-7">
    <SectionHeader>{$t('headers.publish')}</SectionHeader>

    <FkForm formConfig={{debounceTime: 0}} let:form handleSave={handleSnSave}>
      {#each allAllowedSns as item}
        <FkCheckBoxInput
          field={form.getOrRegisterField(item, {initial: true})}
        >
          {$t(`sns.${item}`)}
        </FkCheckBoxInput>
      {/each}
    </FkForm>

    <MenuWrapper>
      {#if publishSns.length}
        <li>
          <MenuItem>
            <span>{$t('menu.publishAll')} </span>
            ({publishSns.map(item => $t(`sns.${item}`)).join(', ')})
          </MenuItem>
        </li>
      {/if}

      {#if meta.telegram}
        <li>
          <MenuItem>{$t('menu.publishOnlyTelegraph')}</MenuItem>
        </li>
      {/if}
      {#if meta.site}
        <li>
          <MenuItem>{$t('menu.publishSite')}</MenuItem>
        </li>
      {/if}
      {#if meta.youtube}
        <li>
          <MenuItem>{$t('menu.publishYoutube')}</MenuItem>
        </li>
      {/if}
    </MenuWrapper>
  </div>

</div>
