import {ChatEvents} from './constants.js';


export default interface BaseState {
  // messages to delete at the end of asking cycle
  messageIds: number[];
  // [handlerIndex, ChatEvents]
  handlerIndexes: [number, ChatEvents][];
}
