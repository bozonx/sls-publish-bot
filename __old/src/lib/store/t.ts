import {deepGet} from 'squidlet-lib';
import { writable, get, derived } from 'svelte/store';

export const tStore = writable({})

export const t = derived(tStore, ($a) => {
  return (tPath: string) => deepGet($a, tPath, tPath)
})
