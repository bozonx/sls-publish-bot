import {PackageIndex} from '../../types/types.js'
import {PackageContext} from '../../packageManager/PackageContext.js';
import {MenuItem} from '../../types/MenuItem.js';
import {MenuDefinition} from '../../menuManager/MenuManager.js';


const TASKS_PATH = 'tasks'


const telegramPost: PackageIndex = (ctx: PackageContext) => {
  const taskList = ctx.tasks.getTasksList()
  const tasksIds = Object.keys(taskList)
  const menuItem: MenuItem = {
    type: 'button',
    view: {
      name: (tasksIds.length)
        ? ctx.i18n.menu.taskMenuDefinition + '\n\n' + ctx.i18n.menu.taskList
        : ctx.i18n.menu.emptyTaskList + '\n\n' + ctx.i18n.menu.taskMenuDefinition,
    },
    pressed() {
      console.log(111, 'menu item pressed')
    },
    async destroy(): Promise<void> {
      console.log(222, 'menu item destory')
    },
  }

  ctx.registerMenuChangeHandler((currentDefinition: MenuDefinition) => {
    if (currentDefinition.path === '') {
      return menuItem
    }
    else if (currentDefinition.path === 'TASKS_PATH') {

    }
    else {
      return
    }
  })
}

export default telegramPost
