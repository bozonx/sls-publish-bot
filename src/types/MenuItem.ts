import {MenuDefinition} from '../menuManager/MenuManager.js';

export interface MenuView {
  name: string,
}

export interface MenuItemContext {
  toPath: (toDefinition?: MenuDefinition) => Promise<void>
}

export interface MenuItem {
  type: 'button'
  view: MenuView
  pressed(itemCtx: MenuItemContext): Promise<void>
  destroy?(): Promise<void>
}
