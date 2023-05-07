import {ElementBase} from '../ElementBase.js';


export interface Button extends ElementBase {
  type: 'Button'
  disabled: boolean
  text: string
  onClick(): void
}
