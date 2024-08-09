import {getAccountInfo} from "telegraph-wrapper"
import {TelegraPhCtl} from '$lib/helpers/telegraPhCtl';


export async function GET(event) {
  const telegraPhCth = new TelegraPhCtl(event.url.searchParams.get('token'))
  const result = await telegraPhCth.getPages(
    Number(event.url.searchParams.get('limit')),
    Number(event.url.searchParams.get('offset'))
  )

  return new Response(JSON.stringify({ result }))
}
