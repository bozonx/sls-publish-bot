<script>
import { Input } from 'flowbite-svelte'
import FktInput from '$lib/components/common/FkInput.svelte'
import {FieldEvent} from 'formkit'


export let field

let value = field.value

const handleInputMount = (field) => {
  field.on(FieldEvent.change, (data) => {
    value = data.value
  })
}
</script>

<FktInput {field} handleMount={handleInputMount}>
  <Input
    bind:value
    {name}
    disabled={true}
    size="lg"
    class="w-full rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:placeholder-gray-400 dark:text-white border p-2.5 text-sm focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500"
  ></Input>
</FktInput>
