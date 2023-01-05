import {TgEntity} from '../types/TgEntity.js';


export function tgInputToMd(rawText: string, entities?: TgEntity[]): string {
  // TODO: наверное экранировать лишние символы???
  // TODO: вырезать нечитаемые символы
  // TODO: см модуль sanitize text

  console.log(1111, rawText, entities)

  if (!entities) return rawText

  const result = ''

  for (const item of entities) {

  }

  return result
}
