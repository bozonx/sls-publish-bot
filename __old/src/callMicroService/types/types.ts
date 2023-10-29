export type ReceiverFn = (functionName: string, ...args: any[]) => void


export interface SerializedObj {
  funcName: string,
  data: any[],
}
