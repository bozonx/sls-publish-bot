
export interface BlogBaseConfig {
  // some PUBLICATION_TYPES
  supportedTypes: string[];
}
export interface BlogTelegramConfig extends BlogBaseConfig {
  channelId: number | string;
  telegraPhAuthorName?: string;
  telegraPhAuthorUrl?: string;
  postFooter?: string;
  storyFooter?: string;
  memFooter?: string;
  reelFooter?: string;
  articlePostTmpl?: string;
  articleFooter?: string;
  //articleFooter?: (TelegraphNode | string)[];
}

export interface BlogConfig {
  // name for displaying in menu
  dispname: string;
  notion: {
    contentPlanDbId: string;
    creativeDbId: string;
    buyTgDbId: string;
    sellTgDbId: string;
    contragentsTgDbId: string;
  },
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
