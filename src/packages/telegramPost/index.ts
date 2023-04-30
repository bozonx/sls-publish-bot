import {PackageIndex} from '../../types/types.js'
import {PackageContext} from '../../packageManager/PackageContext.js';
import {MenuItem, MenuView} from '../../types/MenuItem.js';


const telegramPost: PackageIndex = (ctx: PackageContext) => {
  const menuItem: MenuItem = {
    type: 'button',
    render(): MenuView {
      return {
        name: 'New item'
      }
    },
    pressed() {
      console.log(111, 'menu item pressed')
    },
    async destroy(): Promise<void> {
      console.log(222, 'menu item destory')
    },
  }

  ctx.onMenuChange(async (menuPath: string, registerItem: (item: MenuItem) => void) => {
    if (menuPath !== '') return

    registerItem(menuItem)
  })
}

export default telegramPost
