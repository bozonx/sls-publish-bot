import BaseState from '../types/BaseState';


export function makeBaseState(): BaseState {
  return {
    messageId: -1,
    handlerIndex: -1,
  };
}
