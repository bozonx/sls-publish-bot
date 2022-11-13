import {TELEGRAM_MAX_CAPTION, TELEGRAM_MAX_POST} from '../types/constants';
import TgChat from '../apiTg/TgChat';
import {PublishMenuState} from '../askUser/askPublishMenu';
import {PUBLICATION_TYPES} from '../types/ContentItem';


export default function validateContentPlanPost(
  state: PublishMenuState,
  tgChat: TgChat
) {
  // TODO: Валидация
  //       * при публикации post1000 если симвобов более 1032 то предложить создать post2000 в телеге. лучшее заставить поменять в контент плане
  //       * проверка что post 1000 превышает 1032 + футер для телеги. Не давать создать
  //       * при публикации photos если более 1032 символов то сказать что в телегу не будет опубликовано
  //       * проверка что post2000 превышает для инсты. Не давать создать
  //       * при публикации photos проверка на 2200 символов

  // TODO: photos, narrative - должны иметь 1 или более картинок
  // TODO: если не получилось распознать картинку - то нужно запретить публикацию
  // TODO: если нет картинки, но должна быть - то блокировать ок

  // if not text and image
  if ([
    PUBLICATION_TYPES.mem,
    PUBLICATION_TYPES.story,
    PUBLICATION_TYPES.reels,
  ].includes(state.pubType) && !state.mainImgUrl) {
    throw tgChat.app.i18n.errors.noImage;
  }
  else if ([
    PUBLICATION_TYPES.article,
    PUBLICATION_TYPES.post1000,
    PUBLICATION_TYPES.post2000,
    PUBLICATION_TYPES.announcement,
    // TODO: проверить результирующий текст даже с футером. Включая статью
  ].includes(state.pubType) && !state.postText) {
    throw tgChat.app.i18n.errors.noText;
  }
  // if no social networks to publish
  else if (!state.sns.length) {
    throw tgChat.app.i18n.errors.noSns;
  }

  // TODO: если не совпадает тип публикации с поддержкой соц сетью - то запретить публикацию

  // // if post2000 has more than one image
  // else if (isPost2000 && state.images.length > 1) {
  //   throw tgChat.app.i18n.message.post2000oneImg;
  // }
  // // if text-like post is bigger than 2048
  // else if ((!state.images.length || isPost2000) && clearText.length > TELEGRAM_MAX_POST) {
  //   throw tgChat.app.i18n.message.bigPost;
  // }
  // // if image caption too big
  // else if (state.images.length && clearText.length > TELEGRAM_MAX_CAPTION) {
  //   throw tgChat.app.i18n.message.bigCaption;
  // }
}
