import {createHmac} from 'node:crypto'


// TODO: do it need to be stored separately???
// secret or salt to be hashed with
const SECRET = 'Some secret'


export function makeBotId(botToken: string): string {
  const hash = createHmac('md5', SECRET)

  hash.update(botToken)

  const hashBuff = hash.digest('base64url')

  return hashBuff.toString()
}
