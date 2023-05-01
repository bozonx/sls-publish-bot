import {PackageIndex} from '../../types/types.js'
import {PackageContext} from '../../packageManager/PackageContext.js';
import {MenuItem, MenuItemContext} from '../../types/MenuItem.js';
import {MenuDefinition} from '../../menuManager/MenuManager.js';


export const TASKS_PATH = 'tasks'


function makeTasksMenu(ctx: PackageContext): MenuItem[] {
  const taskList = ctx.tasks.getTasksList()
  const tasksIds = Object.keys(taskList)

  return [
    {
      type: 'button',
      view: {
        name: 'task1',
      },
      async pressed(itemCtx: MenuItemContext) {
        console.log(111, 'menu item pressed')
      },
      // async destroy(): Promise<void> {
      //   console.log(222, 'menu item destory')
      // },
    },
  ]
}

const telegramPost: PackageIndex = (ctx: PackageContext) => {
  ctx.registerMenuChangeHandler((currentDefinition: MenuDefinition) => {
    if (currentDefinition.path === '') {
      return [{
        type: 'button',
        view: {
          name: ctx.i18n.menu.selectManageTasks,
        },
        async pressed(itemCtx: MenuItemContext) {
          const taskList = ctx.tasks.getTasksList()
          const tasksIds = Object.keys(taskList)

          const msg = (tasksIds.length)
            ? ctx.i18n.menu.taskMenuDefinition + '\n\n' + ctx.i18n.menu.taskList
            : ctx.i18n.menu.emptyTaskList + '\n\n' + ctx.i18n.menu.taskMenuDefinition

          await itemCtx.toPath({
            path: TASKS_PATH,
            messageHtml: msg,
          })
        },
      }]
    }
    else if (currentDefinition.path === TASKS_PATH) {
      return makeTasksMenu(ctx)
    }
    else {
      return
    }
  })
}

export default telegramPost
