import {DynamicMenuInstance} from './DynamicMenuInstance.js';


export class DynamicMenuFactory {
  private instances: DynamicMenuInstance[] = []


  makeInstance<InstanceContext = Record<any, any>>(instanceContext: InstanceContext): DynamicMenuInstance {
    const instanceId = String(this.instances.length)
    const newInstance = new DynamicMenuInstance<InstanceContext>(instanceContext, instanceId)

    this.instances.push(newInstance)

    return newInstance
  }


}