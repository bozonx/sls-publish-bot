export interface ElementBase {
  name: string
  attached: boolean
  destroy(): Promise<void>
}
