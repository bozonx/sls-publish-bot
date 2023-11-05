<script>
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import BlogDetails from '$lib/components/BlogDetails.svelte'
import SelectPost from '$lib/components/SelectPost.svelte'
import SectionHeader from '$lib/components/SectionHeader.svelte'
import {breadcrumbs} from '$lib/store/breadcrumbs'
import MenuWrapper from "$lib/components/MenuWrapper.svelte";
import MenuItem from "$lib/components/MenuItem.svelte";


export let data


breadcrumbs.set([
  {href: `/app/${$page.params.blog}`, title: data.blog.title},
  {title: $t('links.contentPlan')}
])
</script>

<div>
  <BlogDetails item={data.blog} />

  <MenuWrapper>
    <li>
      <MenuItem>
        {$t('links.createRecord')}
      </MenuItem>
    </li>
  </MenuWrapper>

  <div>
    <SectionHeader>{$t('links.selectPost')}</SectionHeader>

    <SelectPost postResp={data.postResp} />
  </div>

</div>
