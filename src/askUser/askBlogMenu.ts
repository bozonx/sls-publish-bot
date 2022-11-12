import TgChat from '../apiTg/TgChat';
import {CANCEL_BTN, CANCEL_BTN_CALLBACK} from '../types/constants';
import {compactUndefined} from '../lib/arrays';
import {addSimpleStep} from '../helpers/helpers';
import {startPublishFromContentPlan} from '../publish/startPublishFromContentPlan';
import {startPublishCustomPostTg} from '../publish/startPublishCustomPostTg';
import {startPublishPollTg} from '../publish/startPublishPollTg';


const BLOG_MENU_ACTIONS = {
  CONTENT_PLAN: 'CONTENT_PLAN',
  STORY: 'STORY',
  MEM: 'MEM',
  REEL: 'REEL',
  POLL: 'POLL',
  POST: 'POST',
  ADVERT: 'ADVERT',
};


export async function askBlogMenu(blogName: string, tgChat: TgChat) {
  const blogSns = tgChat.app.config.blogs[blogName].sn;
  const msg = tgChat.app.i18n.menu.blogMenu;
  const buttons = [
    [
      {
        text: tgChat.app.i18n.menu.publish,
        callback_data: BLOG_MENU_ACTIONS.CONTENT_PLAN,
      },
    ],
    (blogSns.telegram)
      ? compactUndefined([
        (blogSns.instagram) ? {
          text: tgChat.app.i18n.menu.makeStory,
          callback_data: BLOG_MENU_ACTIONS.STORY,
        } : undefined,
        {
          text: tgChat.app.i18n.menu.makeReel,
          callback_data: BLOG_MENU_ACTIONS.REEL,
        }
      ])
      : [],
    (blogSns.telegram)
      ?[
        {
          text: tgChat.app.i18n.menu.makeMem,
          callback_data: BLOG_MENU_ACTIONS.MEM,
        },
        {
          text: tgChat.app.i18n.menu.makePost,
          callback_data: BLOG_MENU_ACTIONS.POST,
        }
      ]
      : [],
    (blogSns.telegram)
      ?[
        {
          text: tgChat.app.i18n.menu.makePollTg,
          callback_data: BLOG_MENU_ACTIONS.POLL,
        },
        {
          text: tgChat.app.i18n.menu.makeAdvertTg,
          callback_data: BLOG_MENU_ACTIONS.ADVERT,
        }
      ]
      : [],
    [
      CANCEL_BTN,
    ],
  ];

  await addSimpleStep(tgChat, msg, buttons,async (queryData: string) => {
    if ([
      BLOG_MENU_ACTIONS.CONTENT_PLAN,
      BLOG_MENU_ACTIONS.STORY,
      BLOG_MENU_ACTIONS.MEM,
      BLOG_MENU_ACTIONS.REEL,
      BLOG_MENU_ACTIONS.POLL,
      BLOG_MENU_ACTIONS.POST,
      BLOG_MENU_ACTIONS.ADVERT,
    ].includes(queryData)) {
      return blogActionSelected(queryData, blogName, tgChat)
    }
    else if (queryData === CANCEL_BTN_CALLBACK) {
      return tgChat.steps.cancel();
    }
  });
}

async function blogActionSelected(action: string, blogName: string, tgChat: TgChat) {
  if (action === BLOG_MENU_ACTIONS.CONTENT_PLAN) {
    await startPublishFromContentPlan(blogName, tgChat);
  }
  else if (action === BLOG_MENU_ACTIONS.STORY) {
    const footer = tgChat.app.config.blogs[blogName].sn.telegram?.storyFooter;

    await startPublishCustomPostTg(blogName, tgChat, footer, true, true);
  }
  else if (action === BLOG_MENU_ACTIONS.MEM) {
    const footer = tgChat.app.config.blogs[blogName].sn.telegram?.memFooter;

    await startPublishCustomPostTg(blogName, tgChat, footer, true);
  }
  else if (action === BLOG_MENU_ACTIONS.REEL) {
    const footer = tgChat.app.config.blogs[blogName].sn.telegram?.reelFooter;

    await startPublishCustomPostTg(blogName, tgChat, footer, true, true);
  }
  else if (action === BLOG_MENU_ACTIONS.POLL) {
    await startPublishPollTg(blogName, tgChat);
  }
  else if (action === BLOG_MENU_ACTIONS.POST) {
    const footer = tgChat.app.config.blogs[blogName].sn.telegram?.postFooter;

    await startPublishCustomPostTg(blogName, tgChat, footer);
  }
  else if (action === BLOG_MENU_ACTIONS.ADVERT) {
    await startPublishCustomPostTg(blogName, tgChat, undefined, undefined, undefined, true);
  }
}
