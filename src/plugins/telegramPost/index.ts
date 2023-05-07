import {PackageIndex} from '../../types/types.js'
import {PackageContext} from '../../packageManager/PackageContext.js';
import {MenuItem, MenuItemContext} from '../../../_useless/MenuItem.js';
import {MenuDefinition} from '../../../_useless/menuManager/MenuManager.js';


const telegramPost: PackageIndex = (ctx: PackageContext) => {
  const menuItem: MenuItem = {
    type: 'button',
    view: { name: 'New item' },
    async pressed(itemCtx: MenuItemContext) {
      console.log(111, 'menu item pressed')
    },
    async destroy(): Promise<void> {
      console.log(222, 'menu item destory')
    },
  }

  ctx.registerMenuChangeHandler((currentDefinition: MenuDefinition) => {
    // TODO: лучше проверить весь путь
    if (currentDefinition.name !== '') return

    return [[menuItem]]
  })
}

export default telegramPost
