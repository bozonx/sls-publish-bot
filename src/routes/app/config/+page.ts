import type {PageLoad} from './$types'
import {squidletAppApi} from '$lib/squidletAppApi';


export const load: PageLoad = async (event) => {
  return {
    appConfig: (await squidletAppApi.loadAppConfig()).result,
  }
}
