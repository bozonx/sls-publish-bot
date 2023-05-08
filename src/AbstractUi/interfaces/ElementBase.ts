export interface ElementBase {
  name: string
  attached: boolean
  destroy?(): Promise<void>
}

export type ElementInitial<T extends ElementBase> = Omit<T, 'type' | 'attached'>

export const ELEMENT_DEFAULTS = {
  attached: false,
}
