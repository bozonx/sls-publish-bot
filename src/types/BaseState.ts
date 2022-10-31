import {AppEvents} from './constants';


export default interface BaseState {
  messageId: number;
  // [handlerIndex, AppEvents]
  handlerIndexes: [number, AppEvents][];
}
