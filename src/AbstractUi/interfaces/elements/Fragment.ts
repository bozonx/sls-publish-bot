import {AnyElement} from '../AnyElement.js';


export interface Fragment {
  children: AnyElement[]
}

export const FRAGMENT_TYPE = 'Fragment'

export function fragment(children: AnyElement[]): Fragment {
  return {
    type: FRAGMENT_TYPE,
    children,
  }
}
