import {TelegraPhCtl} from '$lib/helpers/telegraPhCtl'


export async function GET(event) {
  const telegraPhCth = new TelegraPhCtl(event.url.searchParams.get('token'))
  const result = await telegraPhCth.getAccount()

  return new Response(JSON.stringify({ result }))
}
