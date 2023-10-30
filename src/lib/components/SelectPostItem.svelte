<script>
import { page } from '$app/stores'

export let item
</script>

<a href="/app/{$page.params.blog}/publicate/post?item={item.meta.fileName}">
  {item.meta.title}
</a>
