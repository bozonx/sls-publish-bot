<script>
import {Button} from 'flowbite-svelte'
import FktInput from '$lib/components/common/FkInput.svelte'
import {FieldEvent, FormEvent} from "formkit"
import {t} from "$lib/store/t";


export let form

let submittable = form.submittable

form.on(FormEvent.change, () => {
  submittable = form.submittable
})

</script>

<Button on:click={form.handleSubmit()} disabled={!submittable}><slot /></Button>
