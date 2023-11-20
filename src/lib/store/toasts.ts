import { writable } from 'svelte/store';
import { get } from 'svelte/store';
import type {ToastType} from '$lib/types/ToastType'
import {TOAST_DEFAULTS} from '$lib/types/ToastType';
import {TOAST_AUTO_CLOSE_TIMEOUT_SEC} from '$lib/constants';


export const toasts = writable<ToastType>([])

let toastId = 0


export function pushToast(item: ToastType) {
  const id = toastId
  let onTimeoutHandler: any

  toastId++

  item.$onTimeout = (cb: any) => onTimeoutHandler = cb

  const removeItem = () => {
    const newValue: ToastType[] = get(toasts)
    const index = newValue.findIndex((el) => el.id === id)

    if (index >= 0) {
      newValue.splice(index, 1)
      toasts.set(newValue)
    }
  }

  const autoCloseTimeout = setTimeout(() => {
    if (onTimeoutHandler) {
      onTimeoutHandler(removeItem)
    }
    else {
      removeItem()
    }
  }, TOAST_AUTO_CLOSE_TIMEOUT_SEC * 1000)

  toasts.set([...get(toasts), {
    ...TOAST_DEFAULTS,
    ...item,
    id,
    $onclose: () => {
      clearTimeout(autoCloseTimeout)
      removeItem()
    }
  }])
}
