<script>
import { arraySimilar } from 'squidlet-lib'
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import PostEditForm from '$lib/components/PostEditForm.svelte'
import SectionHeader from '$lib/components/SectionHeader.svelte'
import {breadcrumbs} from '$lib/store/breadcrumbs'
import MenuWrapper from "$lib/components/MenuWrapper.svelte";
import MenuItem from "$lib/components/MenuItem.svelte";
import {ALL_SNS} from '$lib/constants'


export let data

const meta = data.post.result.meta
let allAllowedSns = arraySimilar(Object.keys(meta), Object.keys(ALL_SNS))
//let publishSns = [...allAllowedSns]

breadcrumbs.set([
  {href: `/app/${$page.params.blog}`, title: data.blog.title},
  {href: `/app/${$page.params.blog}/contentplan`, title: $t('links.contentPlan')},
  {
    href: `/app/${$page.params.blog}/contentplan/post?postid=${meta.postId}`,
    title: meta.title || meta.postId
  },
  {title: $t('menu.edit')},
])

const handleSnSave = async (values) => {
  //publishSns = Object.keys(values).filter((key) => values[key])
}
</script>

<div>
  <div>
    <PostEditForm item={data.post} blog={data.blog} />
  </div>

  <div class="mt-7">
    <MenuWrapper>
      <li>
        <MenuItem
          href="/app/{$page.params.blog}/contentplan/post?postid={meta.postId}"
        >{$t('headers.publish')}</MenuItem>
      </li>
    </MenuWrapper>
  </div>

</div>
