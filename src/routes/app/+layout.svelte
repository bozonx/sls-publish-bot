<script>
import { onMount } from 'svelte'
import "../../app.postcss"
import "../../styles/styles.css"
import {page} from '$app/stores'
import BreadCrumbs from '$lib/components/layout/BreadCrumbs.svelte'
import TopBar from '$lib/components/layout/TopBar.svelte'
import SideBar from '$lib/components/layout/SideBar.svelte'


let drawerOpen = true
let showBackdrop = false
let windowWidth = 0
const breakPoint = 1024
const toggleDrawer = () => {
  drawerOpen = !drawerOpen
  showBackdrop = windowWidth <= breakPoint && drawerOpen
}

onMount(() => {
})

$: {
  if (windowWidth >= breakPoint) {
    // >= lg
    drawerOpen = true
    showBackdrop = false
  }
  else {
    // < lg
    drawerOpen = false
    showBackdrop = false
  }
}
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div class="min-h-screen lg:flex w-full dark:bg-gray-900 text-gray-900 dark:text-gray-200 text-lg">
  <!--  left col-->
  <div>
    <div
      id="app-drawer"
      hidden={!drawerOpen}
      class="w-80 lg:w-72 max-lg:overflow-y-auto max-lg:overflow-x-clip max-lg:fixed lg:h-fit"
    >
      <SideBar />
    </div>
    <div id="app-drawer-backdrop" hidden={!showBackdrop} on:click={toggleDrawer}></div>
  </div>
  <!-- right col-->
  <div class="flex-1">
    <header>
      <TopBar {toggleDrawer} />
    </header>

    <div class="lg:flex justify-center">
      <main id="app-page" class="mt-4 px-4 sm:px-8">
        <div class="mb-6">
          <BreadCrumbs />
        </div>

        <slot />
      </main>

    </div>

  </div>

</div>
