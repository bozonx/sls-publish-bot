<script>
import {Label, Helper, Input} from 'flowbite-svelte'
import { onMount } from 'svelte'
import {FieldEvent} from 'formkit'


export let handleMount = null
export let field = null
export let form = null
export let name = null
export let initial = null
export let schema = {}

const resolvedField = (field)
  ? field
  : form.getOrRegisterField(name, {...schema, initial})

let savedValue = resolvedField.savedValue
let editedValue = resolvedField.editedValue
let value = resolvedField.value
let fullName = resolvedField.fullName
let dirty = resolvedField.dirty
let touched = resolvedField.touched
let valid = resolvedField.valid
let invalidMsg = resolvedField.invalidMsg
let saving = resolvedField.saving
let focused = resolvedField.focused
let disabled = resolvedField.disabled
let defaultValue = resolvedField.defaultValue

resolvedField.on(FieldEvent.change, (data) => {
  savedValue = resolvedField.savedValue
  editedValue = resolvedField.editedValue
  value = resolvedField.value
  fullName = resolvedField.fullName
  dirty = resolvedField.dirty
  touched = resolvedField.touched
  valid = resolvedField.valid
  invalidMsg = resolvedField.invalidMsg
  saving = resolvedField.saving
  focused = resolvedField.focused
  disabled = resolvedField.disabled
  defaultValue = resolvedField.defaultValue
})

onMount(() => {
  if (handleMount) handleMount(resolvedField)
})
</script>

<slot
  field={resolvedField}
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
