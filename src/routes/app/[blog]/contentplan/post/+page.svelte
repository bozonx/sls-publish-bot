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
import FkCheckBoxInput from "$lib/components/common/FkCheckBoxInput.svelte";


export let data

let publishSns = data.post.result.meta.sns

breadcrumbs.set([
  {href: `/app/${$page.params.blog}`, title: data.blog.title},
  {href: `/app/${$page.params.blog}/contentplan`, title: $t('links.contentPlan')},
  {title: data.post.result.meta.title},
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
    <SectionHeader>{$t('headers.preview')}</SectionHeader>

    <MenuWrapper>
      <li>
        <MenuItem>{$t('menu.previewArticle')}</MenuItem>
      </li>
      <li>
        <MenuItem>{$t('menu.previewPost')}</MenuItem>
      </li>
      <li>
        <MenuItem>{$t('menu.previewTgPost')}</MenuItem>
      </li>
    </MenuWrapper>
  </div>

  <div class="mt-7">
    <SectionHeader>{$t('headers.publishData')}</SectionHeader>

    <MenuWrapper>
      {#if data.post.result.meta.sns.includes('dzen')}
        <li>
          <MenuItem
            href="/app/{$page.params.blog}/contentplan/post/fordzen?item={data.post.result.meta.fileName}"
          >{$t('menu.pubDataZen')}</MenuItem>
        </li>
      {/if}
      {#if arraySimilar(data.post.result.meta.sns, ['spotifyForPodcasters', 'mave']).length}
      <li>
        <MenuItem
          href="/app/{$page.params.blog}/contentplan/post/forpodcast?item={data.post.result.meta.fileName}"
        >{$t('menu.pubDataPodcast')}</MenuItem>
      </li>
      {/if}
      {#if data.post.result.meta.sns.includes('youtube')}
        <li>
          <MenuItem
            href="/app/{$page.params.blog}/contentplan/post/foryoutube?item={data.post.result.meta.fileName}"
          >{$t('menu.pubDataYoutube')}</MenuItem>
        </li>
      {/if}
    </MenuWrapper>
  </div>

  <div class="mt-7">
    <SectionHeader>{$t('headers.publish')}</SectionHeader>

    <FkForm formConfig={{debounceTime: 0}} let:form handleSave={handleSnSave}>
      {#each data.post.result.meta.sns as item}
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

      {#if data.post.result.meta.sns.includes('telegram')}
        <li>
          <MenuItem>{$t('menu.publishOnlyTelegraph')}</MenuItem>
        </li>
      {/if}
      {#if data.post.result.meta.sns.includes('site')}
        <li>
          <MenuItem>{$t('menu.publishSite')}</MenuItem>
        </li>
      {/if}
      {#if data.post.result.meta.sns.includes('youtube')}
        <li>
          <MenuItem>{$t('menu.publishYoutube')}</MenuItem>
        </li>
      {/if}
    </MenuWrapper>
  </div>

</div>
