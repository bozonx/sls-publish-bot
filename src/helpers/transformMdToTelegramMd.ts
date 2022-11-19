import {markdownv2 as mdFormat} from 'telegram-format';


/**
 * Transform ordinary MD to telegram md.
 * In general means escape characters
 */
export function transformMdToTelegramMd(rawText: string): string {

  // TODO: не экранировать ссылки и тд

  return mdFormat.escape(rawText);
}
