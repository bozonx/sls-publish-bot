<script>
import {simpleTemplate, replaceLineBreak} from 'squidlet-lib'
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import {breadcrumbs} from '$lib/store/breadcrumbs'
import {makeStrHashTags, makeTags} from "$lib/helpers"
import SectionHeader from "$lib/components/SectionHeader.svelte"
import SelectContentView from "$lib/components/SelectContentView.svelte"
import RenderHtml from "$lib/components/common/RenderHtml.svelte"
import {convertCommonMdToCleanText} from "$lib/convert/convertCommonMdToCleanText"
import {convertCommonMdToCommonHtml} from "$lib/convert/convertCommonMdToCommonHtml";
import CopyToClipboardButton from "$lib/components/common/CopyToClipboardButton.svelte";
import {CONTENT_VIEW} from "$lib/constants"


export let data

const meta = data.post.result.meta
const md = data.post.result.md

breadcrumbs.set([
  {href: `/app/${$page.params.blog}`, title: data.blog.title},
  {href: `/app/${$page.params.blog}/contentplan`, title: $t('links.contentPlan')},
  {
    href: `/app/${$page.params.blog}/contentplan/post?postid=${meta.postId}`,
    title: meta.title || meta.postId
  },
  {title: $t('menu.previewArticle')},
])

let descrViews = {
  rendered: convertCommonMdToCommonHtml(meta.descr),
  md: meta.descr,
  html: convertCommonMdToCommonHtml(meta.descr),
  clean: convertCommonMdToCleanText(meta.descr),
}
let contentViews = {
  rendered: convertCommonMdToCommonHtml(md),
  md,
  html: convertCommonMdToCommonHtml(md),
  clean: convertCommonMdToCleanText(md),
}
let selectedContent = CONTENT_VIEW.rendered

const switchContentView = (event) => {
  selectedContent = event.detail
}
</script>

<div>
  <section>
    <SectionHeader>{meta.title}</SectionHeader>

    <SelectContentView on:selected={switchContentView} />

    {#if selectedContent === CONTENT_VIEW.rendered}
      <RenderHtml html={descrViews[selectedContent] + contentViews[selectedContent]} />
    {:else if selectedContent === CONTENT_VIEW.html}
      <pre>
{descrViews[selectedContent]}
{contentViews[selectedContent]}
      </pre>
    {:else}
      <pre>
{descrViews[selectedContent]}

{contentViews[selectedContent]}
      </pre>
    {/if}
  </section>

</div>
