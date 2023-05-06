
export interface DynamicMenuItem {
  // unique id
  uid: string,
  // specify name to use it in sorting. Better to make it unique in specific menu level
  name: string,
  // It will be rendered
  label: string,
  // name of icon to use
  icon?: string,
}
