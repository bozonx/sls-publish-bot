import {ReceiverFn, SerializedObj} from './types/types.js';
import {McServer} from './types/McServer.js';


export const MSG_PREFIX = '!DATA!'


export class ProcessServer implements McServer {
  private readonly receiver: ReceiverFn


  constructor(receiver: ReceiverFn) {
    this.receiver = receiver
  }


  async init() {
    process.stdin.on('data', this.handleIncomeMessage)
  }

  async destroy() {
  }


  async send(funcName: string, ...data: any[]) {
    const json = JSON.stringify({
      funcName,
      data
    } as SerializedObj)

    process.stdout.write(MSG_PREFIX + json)
  }

  async sendBin(funcName: string, ...binData: Buffer[]) {
    // TODO: add !!!
  }


  private handleIncomeMessage = async (incomeRawData: Buffer) => {
    const str = incomeRawData.toString()

    if (str.indexOf(MSG_PREFIX) !== 0) return

    const jsonStr = str.split(MSG_PREFIX)[1]
    const {funcName, data}: SerializedObj = JSON.parse(jsonStr)

    this.receiver(funcName, ...data)

    // TODO: how to receive bin data???
  }

}
