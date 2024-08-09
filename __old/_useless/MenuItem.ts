import {MenuDefinition} from '../../../../../../mnt/disk2/workspace/sls-publish-bot/_useless/menuManager/MenuManager';

export interface MenuView {
  name: string,
}

export interface MenuItemContext {
  toPath: (
    name: string,
    messageHtml?: string,
    state?: Record<string, any>,
  ) => Promise<void>
  backToPath(pathTo: string): Promise<void>
  backSteps(stepsNum: number): Promise<void>
}

export interface MenuItem {
  type: 'button'
  view: MenuView
  pressed(itemCtx: MenuItemContext): Promise<void>
  destroy?(): Promise<void>
}
