<script>
import AllBlogs from '$lib/components/AllBlogs.svelte'
import {breadcrumbs} from '$lib/store/breadcrumbs'


breadcrumbs.set([])
export let data
</script>

<div>
  main page

  <AllBlogs items={data.allBlogs} />
</div>
