<script>
import {page} from "$app/stores"


let className = ''

export { className as class }
export let href
export let target = null
</script>

<a class="simple-link {className}" href={href} {target}><slot /></a>
