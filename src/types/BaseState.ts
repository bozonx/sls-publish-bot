import {AppEvents} from './constants';


export default interface BaseState {
  // messages to delete at the end of asking cycle
  messageIds: number[];
  // [handlerIndex, AppEvents]
  handlerIndexes: [number, AppEvents][];
}
