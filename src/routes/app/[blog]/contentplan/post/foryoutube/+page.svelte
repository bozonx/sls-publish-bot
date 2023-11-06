<script>
import {simpleTemplate, replaceLineBreak} from 'squidlet-lib'
import { Alert } from 'flowbite-svelte'
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import {breadcrumbs} from '$lib/store/breadcrumbs'
import {makeStrHashTags, makeTags} from "$lib/helpers"
import SectionHeader from "$lib/components/SectionHeader.svelte"
import {convertCommonMdToCleanText} from "$lib/convert/convertCommonMdToCleanText"
import {convertCommonMdToCommonHtml} from "$lib/convert/convertCommonMdToCommonHtml";


export let data


breadcrumbs.set([
  {href: `/app/${$page.params.blog}`, title: data.blog.title},
  {href: `/app/${$page.params.blog}/contentplan`, title: $t('links.contentPlan')},
  {
    href: `/app/${$page.params.blog}/contentplan/post?item=${data.post.result.meta.fileName}`,
    title: data.post.result.meta.title
  },
  {title: $t('menu.pubDataYoutube')},
])

let tags = makeStrHashTags(
  data.post.result.meta.youtube?.tags,
  data.post.result.meta.common?.tags
)
let links = convertCommonMdToCleanText(data.post.result.meta.youtube?.contentLinks || data.post.result.meta.common?.contentLinks || '').trim()
let result = simpleTemplate(
  replaceLineBreak(data.post.result.meta.youtube?.template || data.post.result.meta.common?.postTemplate),
  {
    DESCR: (data.post.result.meta.descr || '').trim(),
    TIME_CODES: (data.post.result.meta.timeCodes || '').trim(),
    LINKS: links,
    FOOTER: simpleTemplate(
      replaceLineBreak(data.post.result.meta.youtube?.footer || data.post.result.meta.common?.postFooter),
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
    {#if !data.post.result.meta.descr}
      <Alert color="red">{$t('messages.postNoDesrc')}</Alert>
    {/if}
    {#if !data.post.result.meta.timeCodes}
      <Alert color="red">{$t('messages.postNoTimeCodes')}</Alert>
    {/if}
  </div>

  <section>
    <SectionHeader>{$t('headers.descr')}</SectionHeader>

    <pre>{result}</pre>
  </section>

  <section>
    <SectionHeader>{$t('headers.tags')}</SectionHeader>

    <pre>{makeTags(data.post.result.meta.youtube?.tags, data.post.result.meta.common?.tags).join(', ')}</pre>
  </section>

  <section>
    <SectionHeader>{$t('headers.reminder')}</SectionHeader>
    <pre>{@html convertCommonMdToCommonHtml($t('texts.youtubeHint').trim())}</pre>
  </section>
</div>
