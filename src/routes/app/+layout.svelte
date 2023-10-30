<script>
import "../../app.postcss"
import "../../styles.css"
import {page} from '$app/stores'
import BreadCrumbs from '$lib/components/layout/BreadCrumbs.svelte'
import TopBar from '$lib/components/layout/TopBar.svelte'
</script>

<div>
  <header>
    <TopBar />
  </header>

  <div>
    <div>
      <!--sidebar-->
    </div>
    <div class="pt-2">
      <div class="mb-5">
        <BreadCrumbs />
      </div>

      <main>
        <slot />
      </main>
    </div>

  </div>

</div>
