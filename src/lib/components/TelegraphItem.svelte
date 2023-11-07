<script>
import SimpleLink from "$lib/components/common/SimpleLink.svelte"

export let item
</script>


<SimpleLink href={item.url} class="flex w-full mb-4" target="_blank">
  {item.title} ({item.views}){(item.can_edit) ? '' : ` (can't edit)`}
</SimpleLink>

<!--
<a href={item.url} class="flex w-full mb-8">
  <div class="img-col">
    <img src={item.image_url} />
    <div>
      <span>views: {item.views}</span>
      <span>can_edit: {item.can_edit}</span>
    </div>
  </div>
  <div>
    <Heading tag="h4">{item.title}</Heading>
    <p>{item.description}</p>
  </div>
</a>

<style>
.img-col {
  width: 52rem;
}
</style>
-->
