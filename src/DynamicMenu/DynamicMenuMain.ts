import {isPromise} from 'squidlet-lib';
import {DynamicMenuInstance} from './DynamicMenuInstance.js';


export type MenuChangeHandler = (menu: DynamicMenuInstance) => void | Promise<void>


export class DynamicMenuMain {
  private instances: DynamicMenuInstance[] = []
  private registeredHandlers: MenuChangeHandler[] = []


  constructor() {
  }

  async destroy() {
    this.registeredHandlers = []

    for (const itemIndex in this.instances) {
      await this.instances[itemIndex].destroy()

      delete this.instances[itemIndex]
    }
  }


  getInstance(instanceId: string): DynamicMenuInstance | undefined {
    return this.instances[Number(instanceId)]
  }

  makeInstance<InstanceContext extends Record<any, any>>(
    instanceContext: InstanceContext
  ): DynamicMenuInstance<InstanceContext> {
    const instanceId = String(this.instances.length)
    const newInstance = new DynamicMenuInstance<InstanceContext>(
      this,
      instanceContext,
      instanceId
    )

    this.instances.push(newInstance)

    // TODO: когда вызывать instance.init() ????

    return newInstance
  }

  registerMenuHandler(handler: MenuChangeHandler): string {
    this.registeredHandlers.push(handler)

    return String(this.registeredHandlers.length - 1)
  }

  removeHandler(handlerIndex: string) {
    delete this.registeredHandlers[Number(handlerIndex)]
  }

  async emitAllHandlers(menu: DynamicMenuInstance<any>) {
    for (const item of this.registeredHandlers) {
      const res = item(menu)

      if (isPromise(res)) await res
    }
  }

}
