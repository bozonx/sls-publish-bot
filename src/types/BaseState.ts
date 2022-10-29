export default interface BaseState {
  messageId: number;
  // [handlerIndex, eventName]
  handlerIndexes: [number, string][];
}
