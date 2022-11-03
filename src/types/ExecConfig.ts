// Development config

export interface BlogConfig {
  // name for displaying in menu
  dispname: string;
  notionContentPlanDbId: string;
  // some PUBLICATION_TYPES
  supportedTypes: string[];
  sn: {
    telegram?: {
      telegraPhAuthorName: string;
      telegraPhAuthorUrl: string;
      channelId: number | string;
      postFooter: string;
    };
    instagram?: {
    };
    zen?: {
    };
    site?: {
    };
  };
}

export default interface ExecConfig {
  botToken: string;
  notionToken: string;
  telegraPhToken: string;
  logChannelId: number | string;
  // name of blog in object is just uniq name and doesn't matter the name.
  // But please don't change it because it is used in tasks.
  blogs: Record<string, BlogConfig>;
}
