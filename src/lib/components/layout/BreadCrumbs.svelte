<script>
import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte'
import {breadcrumbs} from '$lib/store/breadcrumbs'
import {t} from '$lib/store/t'
</script>


<Breadcrumb aria-label="Default breadcrumb example">
  <BreadcrumbItem href="/" home>{$t('links.home')}</BreadcrumbItem>
  {#each $breadcrumbs as item}
    <BreadcrumbItem href={item.href}>{item.title}</BreadcrumbItem>
  {/each}
</Breadcrumb>
