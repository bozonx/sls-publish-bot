import {objSetMutate} from 'squidlet-lib';
import {MenuItem} from '../types/MenuItem.js';


export type MenuChangeHandler = () => void


export class MenuRegister {
  private menuObj: Record<string, any> = {}


  onMenuChange(cb: MenuChangeHandler) {

  }

  // addMenuItem(pathToMenu: string, itemName: string, menuItem: MenuItem) {
  //   objSetMutate(this.menuObj, pathToMenu + '.' + itemName, menuItem)
  //
  //   console.log(111, this.menuObj)
  // }
}
