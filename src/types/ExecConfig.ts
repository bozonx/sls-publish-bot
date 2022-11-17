import {TelegraphNode} from '../apiTelegraPh/telegraphCli/types';


export interface BlogTelegramConfig {
  telegraPhAuthorName: string;
  telegraPhAuthorUrl: string;
  channelId: number | string;
  postFooter?: string;
  storyFooter?: string;
  memFooter?: string;
  reelFooter?: string;
  articlePostTmpl?: string;
  articleFooter?: (TelegraphNode | string)[];
}

export interface BlogConfig {
  // name for displaying in menu
  dispname: string;
  notionContentPlanDbId: string;
  notionCreativeDbId: string;
  notionBuyTgDbId: string;
  notionSellTgDbId: string;
  notionContragentsTgDbId: string;
  // some PUBLICATION_TYPES
  supportedTypes: string[];
  sn: {
    telegram?: BlogTelegramConfig;
    instagram?: {
    };
    zen?: {
    };
    site?: {
    };
  };
}

export default interface ExecConfig {
  // name of blog in object is just uniq name and doesn't matter the name.
  // But please don't change it because it is used in tasks.
  blogs: Record<string, BlogConfig>;
}
