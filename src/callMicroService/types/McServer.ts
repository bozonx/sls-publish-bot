export interface McServer {
  init(): Promise<void>

  destroy(): Promise<void>

  /**
   * Send primitive data which is supported by JSON
   */
  send(funcName: string, ...data: any[]): Promise<void>

  sendBin(funcName: string, ...binData: Buffer[]): Promise<void>
}
