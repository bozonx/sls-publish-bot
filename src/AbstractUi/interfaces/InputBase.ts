import {ELEMENT_DEFAULTS, ElementBase} from './ElementBase.js';


export interface InputBase extends ElementBase {
  disabled: boolean
}

export type InputInitial<T extends InputBase> = Omit<T, 'type' | 'attached'>

export const INPUT_DEFAULTS = {
  ...ELEMENT_DEFAULTS,
  disabled: false,
}


//type PartialDisabled = Extract<Partial<ElementBase>, 'disabled'>


// TODO: better to pick type from T
//extends PartialDisabled
//& {disabled?: boolean}
//& {disabled?: T['disabled']}
//& Extract<T, 'disabled'>

// export type ElementInitial<T> = {
//   [P in keyof Omit<T, 'type' | 'disabled' | 'attached'>]: T[P]
// } & {disabled?: boolean}
