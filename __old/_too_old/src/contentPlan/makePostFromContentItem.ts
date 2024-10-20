import {NotionBlocks} from '../types/notion';
import {makeResultPostText, resolvePostFooter} from '../helpers/helpers';
import {SN_TYPES, SnType} from '../types/snTypes';
import ContentItem from '../types/ContentItem';
import {PUBLICATION_TYPES} from '../types/publicationType';
import {convertNotionToInstagramPost} from '../helpers/convertNotionToInstagramPost';
import {convertNotionToTgHtml} from '../helpers/convertNotionToTgHtml';
import {BlogConfig} from '../types/BlogsConfig';
import {trimPageBlocks} from '../helpers/convertHelpers';
import {convertCommonMdToTgHtml} from '../helpers/convertCommonMdToTgHtml';


/**
 * Make full post texts for each social media.
 * It depends on publication type
 */
export function makePostFromContentItem(
  sns: SnType[],
  blogCfg: BlogConfig,
  item: ContentItem,
  useTgFooter: boolean,
  textBlocks?: NotionBlocks,
  replacedHtmlText?: string,
  instaTags?: string[]
): Partial<Record<SnType, string>> {
  const result = {} as Record<SnType, string>

  if (sns.includes(SN_TYPES.telegram)) {
    // replacedHtmlText for announcement
    let postText = replacedHtmlText

    if (![
      PUBLICATION_TYPES.article,
      PUBLICATION_TYPES.poll,
    ].includes(item.type) && textBlocks && !replacedHtmlText) {
      const trimmedPost = trimPageBlocks(textBlocks)

      postText = convertNotionToTgHtml(trimmedPost)
    }

    if (postText) {
      result[SN_TYPES.telegram] = makeResultPostText(
        item.sections || [],
        useTgFooter,
        postText,
        convertCommonMdToTgHtml(resolvePostFooter(item.type, blogCfg.sn.telegram!))
      )
    }
  }

  if (sns.includes(SN_TYPES.instagram)) {
    let postText = replacedHtmlText

    if (![
      PUBLICATION_TYPES.article,
      PUBLICATION_TYPES.poll,
    ].includes(item.type) && textBlocks && !replacedHtmlText) {
      const trimmedPost = trimPageBlocks(textBlocks)

      postText = convertNotionToInstagramPost(trimmedPost)
    }

    if (postText) {
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
