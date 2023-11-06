<script>
import {simpleTemplate, replaceLineBreak} from 'squidlet-lib'
import { Alert } from 'flowbite-svelte'
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import {breadcrumbs} from '$lib/store/breadcrumbs'
import {makeStrHashTags} from "$lib/helpers"
import SectionHeader from "$lib/components/SectionHeader.svelte"
import RenderHtml from "$lib/components/common/RenderHtml.svelte"
import {convertCommonMdToCleanText} from "$lib/convert/convertCommonMdToCleanText"
import {convertCommonMdToCommonHtml} from "$lib/convert/convertCommonMdToCommonHtml";


export let data

const meta = data.post.result.meta

breadcrumbs.set([
  {href: `/app/${$page.params.blog}`, title: data.blog.title},
  {href: `/app/${$page.params.blog}/contentplan`, title: $t('links.contentPlan')},
  {
    href: `/app/${$page.params.blog}/contentplan/post?item=${meta.fileName}`,
    title: meta.title
  },
  {title: $t('menu.pubDataZen')},
])

let post = simpleTemplate(
  replaceLineBreak(meta.dzen?.template || meta.common?.postTemplate),
  {
    // TODO: to html
    
    CONTENT: (data.post.result.md || '').trim(),

    // TODO: post или article footer ????
    // TODO: to html

    FOOTER: meta.dzen?.footer || meta.common?.postFooter || '',
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

    <pre>{meta.title}</pre>
  </section>

  <section>
    <SectionHeader>{$t('headers.post')}</SectionHeader>

    <pre>{post}</pre>
  </section>

</div>
