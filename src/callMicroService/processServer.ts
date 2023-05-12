import {ReceiverFn} from './types/types.js';


export const MSG_PREFIX = '!DATA!'


export class ProcessServer {
  private readonly receiver: ReceiverFn


  constructor(receiver: ReceiverFn) {
    this.receiver = receiver
  }


  async init() {
    process.stdin.on('data', (data: Buffer) => {
      const str = data.toString()

      process.stdout.write(MSG_PREFIX + 'output')
    })
  }

  async destroy() {

  }


}
