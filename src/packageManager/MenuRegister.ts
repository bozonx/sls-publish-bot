import {objSetMutate} from 'squidlet-lib';
import {MenuItem} from '../types/MenuItem.js';


export class MenuRegister {
  private menuObj: Record<string, any> = {}


  addMenuItem(pathToItem: string, menuItem: MenuItem) {
    objSetMutate(this.menuObj, pathToItem, menuItem)
  }
}