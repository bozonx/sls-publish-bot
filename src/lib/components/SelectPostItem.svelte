<script>
export let blogName
export let item
</script>

<li>
  <a href="/app/publicate/post?blog={blogName}&item={item.meta.name}">{item.meta.title}</a>
  <div>{item.meta.title}</div>
</li>
