import {ReceiverFn} from './types/types';
import {DataInterface} from './types/DataInterface';


export class DevServer implements DataInterface {
  private readonly receiver: ReceiverFn
  private clientReceive!: ReceiverFn


  constructor(receiver: ReceiverFn) {
    this.receiver = receiver
  }

  async init() {
  }

  async destroy() {
  }


  $setClientReceive(clientReceive: ReceiverFn) {
    this.clientReceive = clientReceive
  }

  $serverIncome(funcName: string, ...data: any[]) {
    this.receiver(funcName, ...data)
  }

  // TODO: не send а request - вернуть данные

  async send(funcName: string, ...data: any[]) {
    this.clientReceive(funcName, ...data)
  }

  async sendBin(funcName: string, ...binData: Buffer[]) {
    // TODO: add !!!
  }

}
