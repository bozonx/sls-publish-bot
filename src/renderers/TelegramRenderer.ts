import System from '../System.js';
import {DynamicMenuInstance} from '../DynamicMenu/DynamicMenuInstance.js';
import {DynamicMenuButton} from '../DynamicMenu/interfaces/DynamicMenuButton.js';


export class TelegramRenderer {
  private system: System
  private menuInstanceContext: Record<string, any> = {}
  private menuInstance!: DynamicMenuInstance


  constructor(system: System) {
    this.system = system
  }


  async init() {
    this.menuInstance = this.system.menu.makeInstance(this.menuInstanceContext)

    this.menuInstance.renderEvent.addListener(this.renderHandler)
  }


  private renderHandler = (menu: DynamicMenuButton[]) => void {
    // TODO: remove previous menu
    // TODO: draw a new one
    // TODO: support of line groups
    // TODO: support of menu message in html
  }

}
