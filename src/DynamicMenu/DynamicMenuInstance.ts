import {IndexedEvents} from 'squidlet-lib';
import {DynamicMenuMain} from './DynamicMenuMain.js';
import {DynamicMenuButton, DynamicMenuButtonState} from './interfaces/DynamicMenuButton.js';
import DynamicBreadCrumbs, {BREADCRUMBS_ROOT} from './DynamicBreadCrumbs.js';


// TODO: пути будут по названиям кнопок
// TODO: нужно дестроить текущее меню при нормальном переходе
// TODO: нужно отменять текущее меню при отмене
// TODO: нужен стейт текущего уровня


export class DynamicMenuInstance<InstanceContext = Record<any, any>> {
  readonly renderEvent = new IndexedEvents()
  readonly breadCrumbs: DynamicBreadCrumbs
  private readonly menuMain: DynamicMenuMain
  private readonly instanceContext: InstanceContext
  private readonly instanceId: string
  private currentMenu: DynamicMenuButton[] = []


  get context(): InstanceContext {
    return this.instanceContext
  }

  get id(): string {
    return this.instanceId
  }


  constructor(
    menuMain: DynamicMenuMain,
    instanceContext: InstanceContext,
    instanceId: string
  ) {
    this.menuMain = menuMain
    this.instanceContext = instanceContext
    this.instanceId = instanceId
    this.breadCrumbs = new DynamicBreadCrumbs()
  }


  async init() {
    this.breadCrumbs.pathChangeEvent.addListener(this.handlePathChange)

    this.breadCrumbs.addStep(BREADCRUMBS_ROOT)
  }


  doRender() {
    this.renderEvent.emit()
  }

  /**
   * It will be called in MenuChangeHandler.
   * It adds item to current menu on render stage
   * @param item
   * @param after - name of element to render after it
   */
  addItem(item: DynamicMenuButton, after?: string) {
    this.currentMenu.push(item)

    // TODO: sort - put it after specified item

  }

  addItemBefore(item: DynamicMenuButton, before: string) {
    this.currentMenu.push(item)

    // TODO: sort - put it before specified item
  }

  updateItem(itemName: string, btnState: Partial<DynamicMenuButtonState>) {
    const foundIndex = this.currentMenu
      .findIndex((el) => el.name === itemName)

    if (foundIndex === -1) return

    this.currentMenu[foundIndex] = {
      ...this.currentMenu[foundIndex],
      ...btnState,
    }
  }


  private handlePathChange = () => {
    (async () => {
      // clear current menu
      this.currentMenu = []
      // call all the handlers
      await this.menuMain.emitAllHandlers()
      // and render the menu
      this.doRender()
    })()
      .catch((e) => {
        // TODO: что делать в случае ошибки???
        throw e
      })
  }

}
