<script>
import {DarkMode} from "flowbite-svelte";
import {BarsSolid} from "flowbite-svelte-icons";
import { page } from '$app/stores';
import TopBarLink from "./TopBarLink.svelte";
import {t} from '$lib/store/t'


export let toggleDrawer
</script>

<div class="flex w-full py-2 px-2">
  <div class="flex-1">
    <ul class="flex pl-1 pr-1">
      <li class="lg:hidden">
        <TopBarLink
          id="topbar-drawer-switch"
          on:click={toggleDrawer}
          isIcon={true}
        ><BarsSolid /></TopBarLink>
      </li>
    </ul>
  </div>

  <ul class="flex">
    <!--<li><TopBarLink href="/app">{$t('links.home')}</TopBarLink></li>-->
    <li><DarkMode size="lg" /></li>
  </ul>
</div>
