<script>
import {page} from "$app/stores"


let className = ''

export { className as class }
</script>

<nav class="list-none space-y-0.5 {className}">
  <slot />
</nav>