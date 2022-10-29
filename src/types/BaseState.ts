import {AppEvents} from './consts';


export default interface BaseState {
  messageId: number;
  // [handlerIndex, AppEvents]
  handlerIndexes: [number, AppEvents][];
}
