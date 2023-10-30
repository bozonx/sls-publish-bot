import type { LayoutLoad } from './$types'
import {tStore} from '$lib/store/t';
import {DEFAULT_LANG} from '$lib/constants';


export const load: LayoutLoad = async (event) => {
  const lang = DEFAULT_LANG
  const translateResp = await event.fetch(`/api/1/translates/${lang}`, {
    method: 'GET',
    headers: { 'content-type': 'application/json' },
  })
  const translates = (await translateResp.json()).result
  // save translates to the store
  tStore.set(translates)

  return {
    translates,
  }
}
