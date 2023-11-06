<script>
import { Button } from 'flowbite-svelte';
import {browser} from '$app/environment'

export let elementId

const copyElementToClipboard = () => {
  if (browser) {
    window.getSelection().removeAllRanges()
    let range = document.createRange()
    range.selectNode(document.getElementById(elementId))
    window.getSelection().addRange(range)
    document.execCommand('copy')
    window.getSelection().removeAllRanges()
  }
}
</script>

<Button on:click={copyElementToClipboard}><slot /></Button>
