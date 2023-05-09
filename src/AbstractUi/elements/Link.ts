import {INPUT_DEFAULTS, InputBase, InputInitial} from '../interfaces/InputBase.js';


export const LINK_TYPE = 'Link'


export interface Link extends InputBase {
  type: typeof LINK_TYPE
  disabled: boolean
  text: string
  path: string
}


export function link(params: InputInitial<Link>): Link {
  return {
    type: LINK_TYPE,
    ...INPUT_DEFAULTS,
    ...params,
  }
}
