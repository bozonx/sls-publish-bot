import {PURPOSE} from '$lib/types/Purpose';


export interface ToastType {
  text: string
  purpose?: keyof typeof PURPOSE
}

export const TOAST_DEFAULTS: Partial<ToastType> = {
  purpose: PURPOSE.log,
}
