import {ElementBase} from './ElementBase.js';


//type PartialDisabled = Extract<Partial<ElementBase>, 'disabled'>

export type ElementInitial<T extends ElementBase> = Omit<T, 'type' | 'attached'>
  // TODO: better to pick type from T
  //extends PartialDisabled
  //& {disabled?: boolean}
  //& {disabled?: T['disabled']}
  //& Extract<T, 'disabled'>

// export type ElementInitial<T> = {
//   [P in keyof Omit<T, 'type' | 'disabled' | 'attached'>]: T[P]
// } & {disabled?: boolean}
