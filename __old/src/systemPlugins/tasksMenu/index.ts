import {PackageIndex} from '../../types/types'
import {PackageContext} from '../../packageManager/PackageContext';
import {MenuItem, MenuItemContext} from '../../../../../../../../../mnt/disk2/workspace/sls-publish-bot/_useless/MenuItem';
import {MenuDefinition} from '../../../../../../../../../mnt/disk2/workspace/sls-publish-bot/_useless/menuManager/MenuManager';


export const TASKS_PATH = 'tasks'


function makeTasksMenu(ctx: PackageContext): MenuItem[][] {
  const taskList = ctx.tasks.getTasksList()
  const tasksIds = Object.keys(taskList)

  return [[
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
  ]]
}

const telegramPost: PackageIndex = (ctx: PackageContext) => {
  ctx.registerMenuChangeHandler((currentDefinition: MenuDefinition) => {
    if (currentDefinition.name === '') {
      return [[{
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

          await itemCtx.toPath(TASKS_PATH, msg)
        },
      }]]
    }
    // TODO: лучше проверить весь путь
    else if (currentDefinition.name === TASKS_PATH) {
      return makeTasksMenu(ctx)
    }
    else {
      return
    }
  })
}

export default telegramPost
