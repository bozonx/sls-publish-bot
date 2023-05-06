import {DynamicMenuFactory} from './DynamicMenuFactory.js';
import {DynamicMenuItem} from './interfaces/DynamicMenuItem.js';


// TODO: пути будут по названиям кнопок


export class DynamicMenuInstance<InstanceContext = Record<any, any>> {
  private readonly menuMain: DynamicMenuFactory
  private readonly instanceContext: InstanceContext
  private readonly instanceId: string


  get context(): InstanceContext {
    return this.instanceContext
  }

  get id(): string {
    return this.instanceId
  }


  constructor(
    menuMain: DynamicMenuFactory,
    instanceContext: InstanceContext,
    instanceId: string
  ) {
    this.menuMain = menuMain
    this.instanceContext = instanceContext
    this.instanceId = instanceId
  }


  /**
   * It will be called in MenuChangeHandler.
   * It adds item to current menu on render stage
   * @param item
   * @param after - name of element to render after it
   */
  addItem(item: DynamicMenuItem, after: string) {

  }


}