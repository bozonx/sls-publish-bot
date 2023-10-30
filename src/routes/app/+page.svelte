<script>
import AllBlogs from '$lib/components/AllBlogs.svelte'


export let data
</script>

<div>
  main page

  <AllBlogs items={data.allBlogs} />
</div>
