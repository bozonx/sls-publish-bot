<script>
import { page } from '$app/stores';


let active = false

$: active = $page.url.pathname === href

export let href = null
export let isIcon = false
export let id
</script>

<a
  {id}
  {href}
  class="{(active) ? 'text-gray-500 dark:text-gray-400' : ''} {isIcon ? 'px-3 py-3' : 'px-5 py-2'} flex items-center gap-x-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
><slot /></a>
