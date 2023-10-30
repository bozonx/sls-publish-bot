import type { LayoutLoad } from './$types'
import {tStore} from '$lib/store/t';


export const load: LayoutLoad = async (event) => {
  const translateResp = await event.fetch(`/api/1/translates/${langStr}`, {
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
