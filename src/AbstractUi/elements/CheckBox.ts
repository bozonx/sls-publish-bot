export interface CheckBox {
  name: string
  visible: boolean
  disabled: boolean
  checked: string
  onClick(checked: boolean): void
}
