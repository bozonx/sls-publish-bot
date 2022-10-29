import RawPageContent from '../types/PageContent';
import ContentItem from '../types/ContentItem';
import {PUBLICATION_TYPES} from '../types/consts';
import TgChat from '../tgApi/TgChat';


export function publishFork(
  contentItem: ContentItem,
  parsedPage: RawPageContent,
  tgChat: TgChat
) {
  // post like
  if ([
    PUBLICATION_TYPES.post1000,
    PUBLICATION_TYPES.post2000,
    PUBLICATION_TYPES.mem,
  ].includes(contentItem.type)) {
    // TODO: add
  }
  // photos like
  else if ([
    PUBLICATION_TYPES.photos,
    PUBLICATION_TYPES.narrative,
  ].includes(contentItem.type)) {
    // TODO: add
  }
  // article
  else if (contentItem.type === PUBLICATION_TYPES.article) {
    // TODO: add
  }
  // TODO: add announcement
  // TODO: add poll
  // TODO: add reels
  // TODO: add video
}
