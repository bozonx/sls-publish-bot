<script>
import {Heading} from 'flowbite-svelte'
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import BlogDetails from '$lib/components/BlogDetails.svelte'

export let data
</script>

<Heading tag="h1">{data.result.meta.title}</Heading>

<div>

</div>
