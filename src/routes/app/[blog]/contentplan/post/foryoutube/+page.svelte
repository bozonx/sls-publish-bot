<script>
import {simpleTemplate, replaceLineBreak} from 'squidlet-lib'
import { Alert } from 'flowbite-svelte'
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import {breadcrumbs} from '$lib/store/breadcrumbs'
import {makeStrHashTags} from "$lib/helpers"


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
let footer = simpleTemplate(
  replaceLineBreak(data.post.result.meta.youtube?.footer || data.post.result.meta.common?.postFooter),
  {
    LINKS: data.post.result.meta.youtube?.contentLinks || data.post.result.meta.common?.contentLinks || '',
    TAGS: tags,
  }
)
let result = [
  data.post.result.meta.descr?.trim(),
  '',
  data.post.result.meta.timeCodes?.trim(),
  '',
  footer
]

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

  <pre>{result.join('\n')}</pre>
</div>
