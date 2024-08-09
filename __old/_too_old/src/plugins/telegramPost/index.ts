import {PackageIndex} from '../../types/types'
import {PackageContext} from '../../packageManager/PackageContext';
import {MenuItem, MenuItemContext} from '../../../../../../../../../mnt/disk2/workspace/sls-publish-bot/_useless/MenuItem';
import {MenuDefinition} from '../../../../../../../../../mnt/disk2/workspace/sls-publish-bot/_useless/menuManager/MenuManager';


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
