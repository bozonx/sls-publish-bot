import {PURPOSE} from '$lib/types/Purpose';


export interface ToastType {
  text: string
  dismissable?: boolean
  purpose?: keyof typeof PURPOSE
}

export const TOAST_DEFAULTS: Partial<ToastType> = {
  dismissable: true,
  purpose: PURPOSE.log,
}
