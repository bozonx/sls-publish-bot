import {Screen} from '../Screen.js';


export interface Route {
  path: string
  screen: Screen
  params?: Record<string, any>
}
