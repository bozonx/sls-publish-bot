import {PackageIndex} from '../../types/types.js'
import {PackageContext} from '../../packageManager/PackageContext.js';
import {MenuItem, MenuItemContext} from '../../types/MenuItem.js';
import {MenuDefinition} from '../../menuManager/MenuManager.js';


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
    if (currentDefinition.path !== '') return

    return [menuItem]
  })
}

export default telegramPost
