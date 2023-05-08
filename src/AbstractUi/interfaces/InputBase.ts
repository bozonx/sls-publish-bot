import {ELEMENT_DEFAULTS, ElementBase} from './ElementBase.js';


export interface InputBase extends ElementBase {
  disabled: boolean
}

export type InputInitial<T extends InputBase> = Omit<T, 'type' | 'attached' | 'disabled'>
  & {disabled?: T['disabled']}

export const INPUT_DEFAULTS = {
  ...ELEMENT_DEFAULTS,
  disabled: false,
}
