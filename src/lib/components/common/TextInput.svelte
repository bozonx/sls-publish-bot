<script>
import { Input } from 'flowbite-svelte'


export let id
export let placeholder
export let disabled
export let readonly
export let type
export let success = false
export let error = false

let color = null

$: {
  if (success) color = 'red'
  else if (error) color = 'green'
  else color = null
}
</script>

<Input {id} {placeholder} {disabled} {readonly} {type} {color} size="lg">
  <!--<EnvelopeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />-->
</Input>
