<script>
import { Toast } from 'flowbite-svelte'
import {onMount, setContext} from 'svelte'
import "../../app.postcss"
import "../../styles/styles.css"
import {page} from '$app/stores'
import BreadCrumbs from '$lib/components/layout/BreadCrumbs.svelte'
import TopBar from '$lib/components/layout/TopBar.svelte'
import SideBar from '$lib/components/layout/SideBar.svelte'
import NotifyItem from '$lib/components/NotifyItem.svelte'
import {toasts} from '$lib/store/toasts'
import {ALL_BLOGS_CONTEXT} from "$lib/constants";


export let data
let drawerOpen = true
let showBackdrop = false
let windowWidth = 0
const breakPoint = 1024
const toggleDrawer = () => {
  drawerOpen = !drawerOpen
  showBackdrop = windowWidth <= breakPoint && drawerOpen
}

setContext(ALL_BLOGS_CONTEXT, data.allBlogs)

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
      <SideBar allBlogs={data.allBlogs} />
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

<div id="toast-container">
  {#each $toasts.reverse() as item}
    {#key item.id}
      <div class="mr-5 mb-2 toast-wrapper">
        <NotifyItem {item} />
      </div>
    {/key}
  {/each}
</div>
