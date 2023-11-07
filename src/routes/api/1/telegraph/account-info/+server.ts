import {getAccountInfo} from "telegraph-wrapper"


export async function GET(event) {
  const result = await getAccountInfo({
    access_token: event.url.searchParams.get('token')
  })

  return new Response(JSON.stringify({ result }))
}
