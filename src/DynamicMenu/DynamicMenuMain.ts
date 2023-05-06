import {DynamicMenuInstance} from './DynamicMenuInstance.js';


export type MenuChangeHandler = (menu: DynamicMenuInstance) => void | Promise<void>


export class DynamicMenuMain {
  private instances: DynamicMenuInstance[] = []
  private registeredHandlers: MenuChangeHandler[] = []


  constructor() {

  }

  async destroy() {
    this.registeredHandlers = []

    // TODO: destroy all the instances
  }


  getInstance(instanceId: string): DynamicMenuInstance | undefined {
    return this.instances[Number(instanceId)]
  }

  makeInstance<InstanceContext = Record<any, any>>(instanceContext: InstanceContext): DynamicMenuInstance {
    const instanceId = String(this.instances.length)
    const newInstance = new DynamicMenuInstance<InstanceContext>(
      this,
      instanceContext,
      instanceId
    )

    this.instances.push(newInstance)

    return newInstance
  }

  registerMenuHandler(handler: MenuChangeHandler): string {
    this.registeredHandlers.push(handler)

    return String(this.registeredHandlers.length - 1)
  }

  removeHandler(handlerIndex: string) {
    delete this.registeredHandlers[handlerIndex]
  }

  async emitAllHandlers() {
    // TODO: поднимаем все хэндлеры в DynamicMenuMain и выполняем их
  }

}
