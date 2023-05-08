import {AnyElement} from '../interfaces/AnyElement.js';
import {ELEMENT_DEFAULTS, ElementBase, ElementInitial} from '../interfaces/ElementBase.js';


export const FRAGMENT_TYPE = 'Fragment'

export interface Fragment extends ElementBase {
  type: typeof FRAGMENT_TYPE
  children: AnyElement[]
}

export function fragment(params: ElementInitial<Fragment>): Fragment {
  return {
    type: FRAGMENT_TYPE,
    ...ELEMENT_DEFAULTS,
    ...params,
  }
}
