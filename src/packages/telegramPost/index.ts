import {PackageIndex} from '../../types/types.js'
import {PackageContext} from '../../packageManager/PackageContext.js';
import {MenuItem} from '../../types/MenuItem.js';


const telegramPost: PackageIndex = (ctx: PackageContext) => {
  const menuItem: MenuItem = {
    type: 'button',
    view: { name: 'New item' },
    pressed() {
      console.log(111, 'menu item pressed')
    },
    async destroy(): Promise<void> {
      console.log(222, 'menu item destory')
    },
  }

  ctx.registerMenuChangeHandler((menuPath: string) => {
    if (menuPath !== '') return

    return menuItem
  })
}

export default telegramPost
