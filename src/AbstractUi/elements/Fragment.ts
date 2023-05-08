import {AnyElement} from '../interfaces/AnyElement.js';
import {ElementBase} from '../interfaces/ElementBase.js';
import {ElementInitial} from '../interfaces/types.js';


export const FRAGMENT_TYPE = 'Fragment'

export interface Fragment extends ElementBase {
  type: typeof FRAGMENT_TYPE
  children: AnyElement[]
}

export function fragment(params: ElementInitial<Fragment>): Fragment {
  return {
    type: FRAGMENT_TYPE,
    ...params,
    attached: false,
  }
}
