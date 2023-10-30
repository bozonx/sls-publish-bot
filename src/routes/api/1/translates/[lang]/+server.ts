import {error} from '@sveltejs/kit'
import fs from 'node:fs/promises'
import path from 'node:path'
import yaml from 'yaml'
import {ROOT_DIR} from '$lib/server/constants.server'
import {SUPPORTED_LANGS, FILE_ENCODE} from '$lib/constants'


export async function GET(event) {
  const lang = event.params.lang
  let locYml

  if (!SUPPORTED_LANGS.includes(lang)) {
    throw error(404, 'Lang not found')
  }

  try {
    locYml = await fs.readFile(
      path.join(ROOT_DIR, 'src', 'i18n', `${lang}.yaml`),
      FILE_ENCODE
    )
  }
  catch (e) {
    throw error(404, 'Translation not found')
  }

  return new Response(JSON.stringify({
    result: yaml.parse(locYml)
  }))
}
