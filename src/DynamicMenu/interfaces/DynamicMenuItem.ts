export type DynamicMenuItemTypes = 'button' | 'checkbox'


export interface DynamicMenuItem {
  // unique id
  uid: string
  type: DynamicMenuItemTypes
  // specify name to use it in sorting. Better to make it unique in specific menu level
  // It also is used as menu path
  name: string
  // It will be rendered
  label: string
  // name of icon to use
  icon?: string
  disabled: boolean
  // if false it will not be rendered
  visible: boolean
  // it is for checkbox
  checked?: boolean
}
