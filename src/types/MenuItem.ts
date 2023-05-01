export interface MenuView {
  name: string,
}

export interface MenuItem {
  type: 'button'
  view: MenuView
  pressed(): void
  destroy(): Promise<void>
}
