

export class DynamicMenuInstance<InstanceContext = Record<any, any>> {
  private readonly instanceContext: InstanceContext
  private readonly instanceId: string


  get context(): InstanceContext {
    return this.instanceContext
  }

  get id(): string {
    return this.instanceId
  }


  constructor(instanceContext: InstanceContext, instanceId: string) {
    this.instanceContext = instanceContext
    this.instanceId = instanceId
  }



}