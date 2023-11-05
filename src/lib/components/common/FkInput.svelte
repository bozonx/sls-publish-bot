<script>
import {Label, Helper, Input} from 'flowbite-svelte'
import { onMount } from 'svelte';
import {FieldEvent} from 'formkit'

export let handleMount = null
export let form
export let name
export let schema = {}

const field = form.getOrRegisterField(name, schema)

let savedValue = field.savedValue
let editedValue = field.editedValue
let value = field.value
let fullName = field.fullName
let dirty = field.dirty
let touched = field.touched
let valid = field.valid
let invalidMsg = field.invalidMsg
let saving = field.saving
let focused = field.focused
let disabled = field.disabled
let defaultValue = field.defaultValue

field.on(FieldEvent.change, (data) => {
  savedValue = field.savedValue
  editedValue = field.editedValue
  value = field.value
  fullName = field.fullName
  dirty = field.dirty
  touched = field.touched
  valid = field.valid
  invalidMsg = field.invalidMsg
  saving = field.saving
  focused = field.focused
  disabled = field.disabled
  defaultValue = field.defaultValue
})

onMount(() => {
  if (handleMount) handleMount(form, field)
})
</script>

<slot
  {field}
  {savedValue}
  {editedValue}
  {value}
  {fullName}
  {dirty}
  {touched}
  {valid}
  {invalidMsg}
  {saving}
  {focused}
  {disabled}
  {defaultValue}
/>
