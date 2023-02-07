import {NotionBlocks} from '../types/notion.js';
import {makeResultPostText, resolvePostFooter} from '../helpers/helpers.js';
import {SN_TYPES, SnType} from '../types/snTypes.js';
import ContentItem from '../types/ContentItem.js';
import {PUBLICATION_TYPES} from '../types/publicationType.js';
import {transformNotionToInstagramPost} from '../helpers/transformNotionToInstagramPost.js';
import {transformNotionToTgHtml} from '../helpers/transformNotionToTgHtml.js';
import {BlogConfig} from '../types/BlogsConfig.js';


/**
 * Make full post texts for each social media.
 * It depends on publication type
 */
export async function makePostFromContentItem(
  sns: SnType[],
  blogCfg: BlogConfig,
  item: ContentItem,
  useTgFooter: boolean,
  textBlocks?: NotionBlocks,
  replacedHtmlText?: string,
  instaTags?: string[]
): Promise<Partial<Record<SnType, string>>> {
  const result = {} as Record<SnType, string>

  if (sns.includes(SN_TYPES.telegram)) {
    // replacedHtmlText for announcement
    let postText = replacedHtmlText

    if (![
      PUBLICATION_TYPES.article,
      PUBLICATION_TYPES.poll,
    ].includes(item.type) && textBlocks && !replacedHtmlText) {
      postText = transformNotionToTgHtml(textBlocks)
    }

    if (postText) {
      result[SN_TYPES.telegram] = makeResultPostText(
        item.tgTags || [],
        useTgFooter,
        postText,
        resolvePostFooter(item.type, blogCfg.sn.telegram!)
      )
    }
  }

  if (sns.includes(SN_TYPES.instagram)) {
    let postText = replacedHtmlText

    if (![
      PUBLICATION_TYPES.article,
      PUBLICATION_TYPES.poll,
    ].includes(item.type) && textBlocks && !replacedHtmlText) {
      // TODO: а может лучше делать html ???
      postText = transformNotionToInstagramPost(textBlocks)
    }

    if (result[SN_TYPES.instagram]) {
      // add tags at the end of text
      result[SN_TYPES.instagram] = makeResultPostText(
        instaTags || [],
        true,
        postText,
        resolvePostFooter(item.type, blogCfg.sn.instagram!)
      )
    }
  }

  // in site post will be converted to article

  return result
}
