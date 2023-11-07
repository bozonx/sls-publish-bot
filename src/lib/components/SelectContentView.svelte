<script>
import { ButtonGroup, Button } from 'flowbite-svelte'
import { createEventDispatcher } from 'svelte'
import {CONTENT_VIEW} from '$lib/constants'

const dispatch = createEventDispatcher()

let selected = CONTENT_VIEW.rendered
const handleClick = (contentName) => {
  selected = contentName
  dispatch('selected', contentName)
}
const defaultColor = null
</script>

<ButtonGroup>
  <Button
    on:click={() => handleClick(CONTENT_VIEW.rendered)}
    color={(selected === CONTENT_VIEW.rendered) ? 'dark' : defaultColor}
  >Rendered</Button>
  <Button
    on:click={() => handleClick(CONTENT_VIEW.md)}
    color={(selected === CONTENT_VIEW.md) ? 'dark' : defaultColor}
  >Markdown</Button>
  <Button
    on:click={() => handleClick(CONTENT_VIEW.html)}
    color={(selected === CONTENT_VIEW.html) ? 'dark' : defaultColor}
  >HTML</Button>
  <Button
    on:click={() => handleClick(CONTENT_VIEW.clean)}
    color={(selected === CONTENT_VIEW.clean) ? 'dark' : defaultColor}
  >Clean</Button>
</ButtonGroup>
