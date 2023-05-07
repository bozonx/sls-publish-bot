export interface ElementBase {
  name: string
  visible: boolean
  // render first time or force update if it needs
  render(): Promise<void>
  destroy(): Promise<void>
}
