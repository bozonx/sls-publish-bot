export interface DynamicMenuButtonState {
  // It will be rendered
  label: string
  // name of icon to use
  icon?: string
  disabled: boolean
  // if false it will not be rendered
  visible: boolean
}

/**
 * It is button of menu
 */
export interface DynamicMenuButton extends DynamicMenuButtonState {
  // unique id
  uid: string
  // specify name to use it in sorting. Better to make it unique in specific menu level
  // It also is used as menu path
  name: string
}
