<script>
import {Heading} from 'flowbite-svelte'
import BlogItem from '$lib/components/BlogItem.svelte'
import {t} from '$lib/store/t'

export let items
</script>

<div>
  <Heading tag="h4">{$t('headers.allBlogs')}</Heading>

  <ul>
    {#each items.result as item}
      <BlogItem {item} />
    {/each}
  </ul>
</div>
