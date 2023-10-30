<script>
import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte'
import {breadcrumbs} from '$lib/store/breadcrumbs'
</script>


<Breadcrumb aria-label="Default breadcrumb example">
  <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
  {#each $breadcrumbs as item}
    <BreadcrumbItem href={item.href}>{item.title}</BreadcrumbItem>
  {/each}
</Breadcrumb>
