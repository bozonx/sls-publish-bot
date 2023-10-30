<script>
import "../../app.postcss"
import "../../styles.css"
import {page} from '$app/stores'
import BreadCrumbs from '$lib/components/layout/BreadCrumbs.svelte'
</script>

<div>
  <div>
    <BreadCrumbs />
  </div>


  <slot />
</div>
