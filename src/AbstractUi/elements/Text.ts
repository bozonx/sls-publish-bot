import {ELEMENT_DEFAULTS, ElementBase, ElementInitial} from '../interfaces/ElementBase.js';


export const TEXT_TYPE = 'Text'


export interface Text extends ElementBase {
  type: typeof TEXT_TYPE
  text: string
}


export function text(params: ElementInitial<Text>): Text {
  return {
    type: TEXT_TYPE,
    ...ELEMENT_DEFAULTS,
    ...params
  }
}
