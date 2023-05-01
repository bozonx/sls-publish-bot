import {PackageIndex} from '../../types/types.js'
import {PackageContext} from '../../packageManager/PackageContext.js';
import {MenuItem} from '../../types/MenuItem.js';
import {MenuDefinition} from '../../menuManager/MenuManager.js';


const TASKS_PATH = 'tasks'


function makeTasksMenu(ctx: PackageContext): MenuItem[] {
  const taskList = ctx.tasks.getTasksList()
  const tasksIds = Object.keys(taskList)

  return [
    {
      type: 'button',
      view: {
        name: 'task1',
      },
      pressed() {
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
        pressed() {
          const taskList = ctx.tasks.getTasksList()
          const tasksIds = Object.keys(taskList)

          const msg = (tasksIds.length)
            ? ctx.i18n.menu.taskMenuDefinition + '\n\n' + ctx.i18n.menu.taskList
            : ctx.i18n.menu.emptyTaskList + '\n\n' + ctx.i18n.menu.taskMenuDefinition

          //ctx.
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
