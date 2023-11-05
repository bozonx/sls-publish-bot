<script>
import {newForm, FormEvent} from 'formkit'


export let formConfig = {}
export let initFields = []

const form = newForm(formConfig)

form.init(initFields)

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
