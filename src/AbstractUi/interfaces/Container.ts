import {AnyElement} from './AnyElement.js';


export interface Container {
  name: string
  visible: boolean
  children: AnyElement
}
