import {ReceiverFn} from './types/types.js';
import {DataInterface} from './types/DataInterface.js';
import {DevServer} from './DevServer.js';


export class DevClient implements DataInterface {
  private readonly receiver: ReceiverFn
  private readonly devServer: DevServer


  constructor(receiver: ReceiverFn, devServer: DevServer) {
    this.receiver = receiver
    this.devServer = devServer

    this.devServer.$serverIncome((funcName: string, ...data: any[]) => {
      this.receiver(funcName, ...data)
    })
  }


  async init() {
  }

  async destroy() {
  }


  async send(funcName: string, ...data: any[]) {
    this.devServer.$serverIncome(funcName, ...data)
  }

  async sendBin(funcName: string, ...binData: Buffer[]) {
    // TODO: add !!!
  }

}
