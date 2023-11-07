<script>
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import SectionHeader from '$lib/components/SectionHeader.svelte'
import {breadcrumbs} from '$lib/store/breadcrumbs'
import DetailItem from "$lib/components/DetailItem.svelte"


export let data


breadcrumbs.set([
  {href: `/app/${$page.params.blog}`, title: data.blog.title},
  {title: $t('links.telegraphCrtl')}
])

let accountInfo
let pages

const loadInfo = async () => {
  const resp = await fetch(
    `/api/1/telegraph/account-info?token=${data.blog.config.telegraph.token}`,
    {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    }
  )

  accountInfo = (await resp.json()).result
}
const loadPages = async (limit, offset) => {
  const resp = await fetch(
    `/api/1/telegraph/pages?token=${data.blog.config.telegraph.token}&limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    }
  )

  pages = (await resp.json()).result
}

loadInfo()
loadPages(2, 0)

</script>

<div>

  <div>
    <SectionHeader>{$t('links.telegraphCrtl')}</SectionHeader>

    {#if accountInfo}
      <div>
      <DetailItem label="author_name">{accountInfo.author_name}</DetailItem>
      <DetailItem label="author_url"><a href={accountInfo.author_url}>{accountInfo.author_url}</a></DetailItem>
      <DetailItem label="short_name">{accountInfo.short_name}</DetailItem>
      </div>
    {:else}
      <div>...</div>
    {/if}

    {#if pages}
      <ul>
        {#each pages.pages as item}
          <li>
            <a href={item.url} class="block">
              <h4>{item.title}</h4>
              <div>
                <span>can edit: {item.can_edit}</span>
                <span>views: {item.views}</span>
              </div>
              <img src={item.image_url} />
              <p>{item.description}</p>
            </a>
          </li>
        {/each}
      </ul>
      <div>{pages.total_count}</div>
    {:else}
      <div>...</div>
    {/if}
  </div>
</div>
