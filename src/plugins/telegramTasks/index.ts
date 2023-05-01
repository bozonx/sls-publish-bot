import {PackageIndex} from '../../types/types.js'
import {PackageContext} from '../../packageManager/PackageContext.js';
import {MenuItemContext} from '../../types/MenuItem.js';
import {MenuDefinition} from '../../menuManager/MenuManager.js';
import {TASKS_PATH} from '../../systemPlugins/tasksMenu/index.js';


const telegramPost: PackageIndex = (ctx: PackageContext) => {
  ctx.registerMenuChangeHandler((currentDefinition: MenuDefinition) => {
    if (currentDefinition.path === TASKS_PATH) {
      return [
        {
          type: 'button',
          view: {
            name: ctx.i18n.menu.flushTask,
          },
          async pressed(itemCtx: MenuItemContext) {
          },
        },
        {
          type: 'button',
          view: {
            name: ctx.i18n.menu.deleteTask,
          },
          async pressed(itemCtx: MenuItemContext) {
          },
        },
        {
          type: 'button',
          view: {
            name: ctx.i18n.menu.changeTaskExecDate,
          },
          async pressed(itemCtx: MenuItemContext) {
          },
        },
        {
          type: 'button',
          view: {
            name: ctx.i18n.menu.changeTaskAutoDeleteDate,
          },
          async pressed(itemCtx: MenuItemContext) {
          },
        },
        {
          type: 'button',
          view: {
            name: ctx.i18n.menu.changeTaskAutoDeleteDate,
          },
          async pressed(itemCtx: MenuItemContext) {
          },
        },
      ]
    }
    else {
      return
    }
  })
}

export default telegramPost
