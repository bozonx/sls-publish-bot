<script>
import {newForm, FormEvent} from 'formkit'
import {onMount} from "svelte"
// import { createEventDispatcher } from 'svelte'
//
// const dispatch = createEventDispatcher()

export let handleMount = null
export let formConfig = {}
export let initFields = {}
export let handleSave = null
export let handleSubmit = null
export let validateCb = undefined

const form = newForm(formConfig)

form.init(initFields, validateCb)

let finalFormConfig = form.config
let values = form.values
let savedValues = form.savedValues
let editedValues = form.editedValues
let unsavedValues = form.unsavedValues
let dirty = form.dirty
let touched = form.touched
let saving = form.saving
let submitting = form.submitting
let submittable = form.submittable
let savable = form.savable
let valid = form.valid
let invalidMessages = form.invalidMessages


form.on(FormEvent.change, () => {
  finalFormConfig = form.config
  values = form.values
  savedValues = form.savedValues
  editedValues = form.editedValues
  unsavedValues = form.unsavedValues
  dirty = form.dirty
  touched = form.touched
  saving = form.saving
  submitting = form.submitting
  submittable = form.submittable
  savable = form.savable
  valid = form.valid
  invalidMessages = form.invalidMessages
})

form.onSave(async (values) => {
  //dispatch('save', values)
  await handleSave?.(values)
})

form.onSubmit(async (values) => {
  //dispatch('submit', values)
  await handleSubmit?.(values)
})

onMount(() => {
  if (handleMount) handleMount(form)
})

</script>

<form on:submit|preventDefault={() => form.handleSubmit()}>
  <slot
    {form}
    formConfig={finalFormConfig}
    {values}
    {savedValues}
    {editedValues}
    {unsavedValues}
    {dirty}
    {touched}
    {saving}
    {submitting}
    {submittable}
    {savable}
    {valid}
    {invalidMessages}
  />
</form>
