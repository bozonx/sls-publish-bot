import { writable } from 'svelte/store';
import { get } from 'svelte/store';
import type {ToastType} from '$lib/types/ToastType'
import {TOAST_DEFAULTS} from '$lib/types/ToastType';


export const toasts = writable<ToastType>([])

let toastId = 0


export function pushToast(item: ToastType) {
  const id = toastId

  toasts.set([...get(toasts), {
    ...TOAST_DEFAULTS,
    ...item,
    id,
    $onclose: () => {
      const newValue: ToastType[] = get(toasts)
      const index = newValue.findIndex((el) => el.id === id)

      if (index >= 0) {
        newValue.splice(index, 1)

        toasts.set(newValue)
      }
    }
  }])

  toastId++

  // TODO: set timeout
}
