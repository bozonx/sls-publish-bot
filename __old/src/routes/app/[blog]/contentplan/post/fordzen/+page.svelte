<script>
import {simpleTemplate, replaceLineBreak} from 'squidlet-lib'
import { Alert } from 'flowbite-svelte'
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import {breadcrumbs} from '$lib/store/breadcrumbs'
import {makeStrHashTags} from "$lib/helpers"
import SectionHeader from "$lib/components/SectionHeader.svelte"
import RenderHtml from "$lib/components/common/RenderHtml.svelte"
import CopyToClipboardButton from "$lib/components/common/CopyToClipboardButton.svelte"
import {convertCommonMdToCommonHtml} from "$lib/convert/convertCommonMdToCommonHtml"
import {POST_TYPES} from "$lib/constants"


export let data

const meta = data.post.result.meta

breadcrumbs.set([
  {href: `/app/${$page.params.blog}`, title: data.blog.title},
  {href: `/app/${$page.params.blog}/contentplan`, title: $t('links.contentPlan')},
  {
    href: `/app/${$page.params.blog}/contentplan/post?postid=${meta.postId}`,
    title: meta.title || meta.postId
  },
  {title: $t('menu.pubDataZen')},
])

let post = simpleTemplate(
  replaceLineBreak(meta.dzen?.template || meta.common?.postTemplate),
  {
    CONTENT: convertCommonMdToCommonHtml((data.post.result.md || '').trim()),
    FOOTER: convertCommonMdToCommonHtml((
      meta.dzen?.footer
      || ((meta.type === POST_TYPES.article)
        ? meta.common?.footer
        : meta.common?.postFooter)
      || ''
    ).trim()),
  }
)
</script>

<div>
  <section>
    <SectionHeader>{$t('headers.reminder')}</SectionHeader>
    <RenderHtml html={convertCommonMdToCommonHtml($t('texts.dzenHint').trim())} />
  </section>

  <section>
    <SectionHeader>{$t('headers.header')}</SectionHeader>

    <CopyToClipboardButton elementId="dzen-header">{$t('links.copyToClipboard')}</CopyToClipboardButton>

    <pre id="dzen-header">{meta.title}</pre>
  </section>

  <section>
    <SectionHeader>{$t('headers.post')}</SectionHeader>

    <CopyToClipboardButton elementId="dzen-content">{$t('links.copyToClipboard')}</CopyToClipboardButton>

    <RenderHtml id="dzen-content" html={post}></RenderHtml>
  </section>

</div>
