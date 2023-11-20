<script>
import { Toast } from 'flowbite-svelte'
import {
  CheckCircleSolid,
  CloseCircleSolid,
  ExclamationCircleSolid,
  InfoCircleSolid,
  AnnotationSolid,
} from "flowbite-svelte-icons"
import { slide } from 'svelte/transition';
import { quintOut } from 'svelte/easing';
import {PURPOSE, PURPOSE_TO_COLOR} from '$lib/types/Purpose'

export let item

const duration = 300
//position="bottom-right"

const onClose = () => {
  setTimeout(() => {
    item.$onclose()
  }, duration)
}
</script>


<Toast
  transition={slide}
  params={{ duration: duration, easing: quintOut }}
  color={PURPOSE_TO_COLOR[item.purpose]}
  dismissable={true}
  on:close={onClose}
>
  <svelte:fragment slot="icon">
    {#if item.purpose === PURPOSE.error}
      <CloseCircleSolid class="w-5 h-5" />
      <span class="sr-only">Cross icon</span>
    {:else if item.purpose === PURPOSE.warn}
      <ExclamationCircleSolid class="w-5 h-5" />
      <span class="sr-only">Exclamation icon</span>
    {:else if item.purpose === PURPOSE.info}
      <InfoCircleSolid class="w-5 h-5" />
      <span class="sr-only">Info icon</span>
    {:else if item.purpose === PURPOSE.success}
      <CheckCircleSolid class="w-5 h-5" />
      <span class="sr-only">Check icon</span>
    {:else if item.purpose === PURPOSE.log}
      <AnnotationSolid class="w-5 h-5" />
      <span class="sr-only">Annotation icon</span>
    {/if}
  </svelte:fragment>
  {item.text}
</Toast>
