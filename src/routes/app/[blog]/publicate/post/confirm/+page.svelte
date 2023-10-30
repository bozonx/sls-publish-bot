<script>
import {Heading} from 'flowbite-svelte'
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import BlogDetails from '$lib/components/BlogDetails.svelte'
import PostDetails from '$lib/components/PostDetails.svelte'
import PublicationMenu from '$lib/components/PublicationMenu.svelte'

export let data
</script>

<Heading tag="h1">{$t('headers.confirm')}</Heading>

<div>

</div>
