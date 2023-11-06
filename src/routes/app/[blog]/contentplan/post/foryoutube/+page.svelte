<script>
import {simpleTemplate, replaceLineBreak} from 'squidlet-lib'
import { Alert } from 'flowbite-svelte'
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import {breadcrumbs} from '$lib/store/breadcrumbs'
import {makeStrHashTags, makeTags} from "$lib/helpers"
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
  {title: $t('menu.pubDataYoutube')},
])

let tags = makeStrHashTags(
  meta.youtube?.tags,
  meta.common?.tags
)
let links = convertCommonMdToCleanText(meta.youtube?.contentLinks || meta.common?.contentLinks || '').trim()
let result = simpleTemplate(
  replaceLineBreak(meta.youtube?.template || meta.common?.postTemplate),
  {
    DESCR: (meta.descr || '').trim(),
    TIME_CODES: (meta.timeCodes || '').trim(),
    LINKS: links,
    FOOTER: simpleTemplate(
      replaceLineBreak(meta.youtube?.postFooter || meta.common?.postFooter),
        {
          LINKS: links,
          TAGS: tags,
        }
      ),
    TAGS: tags,
  }
)

</script>

<div>
  <div class="mb-7">
    {#if !meta.descr}
      <Alert color="red">{$t('messages.postNoDesrc')}</Alert>
    {/if}
    {#if !meta.timeCodes}
      <Alert color="red">{$t('messages.postNoTimeCodes')}</Alert>
    {/if}
  </div>

  <section>
    <SectionHeader>{$t('headers.reminder')}</SectionHeader>
    <RenderHtml html={convertCommonMdToCommonHtml($t('texts.youtubeHint').trim())} />
  </section>

  <section>
    <SectionHeader>{$t('headers.descr')}</SectionHeader>

    <pre>{result}</pre>
  </section>

  <section>
    <SectionHeader>{$t('headers.tags')}</SectionHeader>

    <pre>{makeTags(meta.youtube?.tags, meta.common?.tags).join(', ')}</pre>
  </section>

</div>
