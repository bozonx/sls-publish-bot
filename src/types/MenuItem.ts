export interface MenuView {
  name: string,
}

export interface MenuItem {
  type: 'button'
  render(): MenuView
  pressed(): void
  destroy(): Promise<void>
}
