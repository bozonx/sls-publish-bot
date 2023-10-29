import {ReceiverFn} from './types/types';
import {DataInterface} from './types/DataInterface';
import {DevServer} from './DevServer';


export class DevClient implements DataInterface {
  private readonly receiver: ReceiverFn
  private readonly devServer: DevServer


  constructor(receiver: ReceiverFn, devServer: DevServer) {
    this.receiver = receiver
    this.devServer = devServer

    this.devServer.$setClientReceive((funcName: string, ...data: any[]) => {
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
