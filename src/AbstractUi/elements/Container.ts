import {AnyElement} from '../interfaces/AnyElement.js';


export interface Container {
  name: string
  visible: boolean
  children: AnyElement
}
