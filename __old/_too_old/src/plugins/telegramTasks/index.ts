import {PackageIndex} from '../../types/types'
import {PackageContext} from '../../packageManager/PackageContext';
import {MenuItemContext} from '../../../../../../../../../mnt/disk2/workspace/sls-publish-bot/_useless/MenuItem';
import {MenuDefinition} from '../../../../../../../../../mnt/disk2/workspace/sls-publish-bot/_useless/menuManager/MenuManager';
import {TASKS_PATH} from '../../systemPlugins/tasksMenu';


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
