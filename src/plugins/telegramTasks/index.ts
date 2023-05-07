import {PackageIndex} from '../../types/types.js'
import {PackageContext} from '../../packageManager/PackageContext.js';
import {MenuItemContext} from '../../../_useless/MenuItem.js';
import {MenuDefinition} from '../../../_useless/menuManager/MenuManager.js';
import {TASKS_PATH} from '../../systemPlugins/tasksMenu/index.js';


const telegramPost: PackageIndex = (ctx: PackageContext) => {
  ctx.registerMenuChangeHandler((currentDefinition: MenuDefinition) => {
    // TODO: лучше проверить весь путь
    if (currentDefinition.name === TASKS_PATH) {
      return [
        [
          {
            type: 'button',
            view: {
              name: ctx.i18n.buttons.deletePost,
            },
            async pressed(itemCtx: MenuItemContext) {
            },
          },
          {
            type: 'button',
            view: {
              name: ctx.i18n.buttons.clonePost,
            },
            async pressed(itemCtx: MenuItemContext) {
            },
          },
        ],
        [
          {
            type: 'button',
            view: {
              name: ctx.i18n.buttons.pinPost,
            },
            async pressed(itemCtx: MenuItemContext) {
            },
          },
          {
            type: 'button',
            view: {
              name: ctx.i18n.buttons.unpinPost,
            },
            async pressed(itemCtx: MenuItemContext) {
            },
          },
        ],
        [
          {
            type: 'button',
            view: {
              name: ctx.i18n.buttons.finishPoll,
            },
            async pressed(itemCtx: MenuItemContext) {
            },
          },
        ],
      ]
    }
    else {
      return
    }
  })
}

export default telegramPost
