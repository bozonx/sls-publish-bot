<script>
import {simpleTemplate, replaceLineBreak} from 'squidlet-lib'
import { Alert } from 'flowbite-svelte'
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import {breadcrumbs} from '$lib/store/breadcrumbs'
import {makeStrHashTags, makeTags} from "$lib/helpers"
import SectionHeader from "$lib/components/SectionHeader.svelte"
import RenderHtml from "$lib/components/common/RenderHtml.svelte"
import {convertCommonMdToCommonHtml} from "$lib/convert/convertCommonMdToCommonHtml";
import CopyToClipboardButton from "$lib/components/common/CopyToClipboardButton.svelte";


export let data

const meta = data.post.result.meta

breadcrumbs.set([
  {href: `/app/${$page.params.blog}`, title: data.blog.title},
  {href: `/app/${$page.params.blog}/contentplan`, title: $t('links.contentPlan')},
  {
    href: `/app/${$page.params.blog}/contentplan/post?item=${meta.fileName}`,
    title: meta.title
  },
  {title: $t('menu.pubDataPodcast')},
])

let tags = makeStrHashTags(meta.podcast?.tags, meta.common?.tags)
let descr = simpleTemplate(
  meta.podcast?.template || meta.common?.postTemplate,
  {
    DESCR: convertCommonMdToCommonHtml(meta.descr?.trim()),
    TIME_CODES: (meta.timeCodes || '').trim().replace(/\n/g, '<br />'),
    LINKS: convertCommonMdToCommonHtml((meta.podcast?.contentLinks || meta.common?.contentLinks || '').trim()),
    FOOTER: convertCommonMdToCommonHtml(simpleTemplate(
      replaceLineBreak(meta.podcast?.footer || meta.common?.postFooter),
        {
          TAGS: tags,
        }
      )),
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
    <RenderHtml html={convertCommonMdToCommonHtml($t('texts.podcastHint').trim())} />
  </section>

  <section>
    <SectionHeader>{$t('headers.descr')}</SectionHeader>

    <CopyToClipboardButton elementId="podcast-descr">{$t('links.copyToClipboard')}</CopyToClipboardButton>

    <pre>
      <code id="podcast-descr" class="block">{descr}</code>
    </pre>
  </section>

</div>
