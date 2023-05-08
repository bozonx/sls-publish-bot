import {ElementBase} from '../interfaces/ElementBase.js';
import {ElementInitial} from '../interfaces/types.js';


export const BUTTON_TYPE = 'Button'


export interface Button extends ElementBase {
  type: typeof BUTTON_TYPE
  disabled: boolean
  text: string
  onClick(): void
}


export function button(params: ElementInitial<Button>): Button {
  return {
    type: BUTTON_TYPE,
    ...params,
    disabled: Boolean(params.disabled),
    attached: false,
  }
}
