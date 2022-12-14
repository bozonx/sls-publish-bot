export interface UnknownDict {
  [index: string]: unknown;
}

export const isUnknownDict = (candidate: unknown): candidate is UnknownDict =>
  typeof candidate === 'object' && candidate !== null;

export const isErr = (val: unknown): val is Error => val instanceof Error;

export const isStr = (val: unknown): val is string => typeof val === 'string';

export const isNum = (val: unknown): val is number => typeof val === 'number';

export const isBool = (val: unknown): val is boolean => typeof val === 'boolean';

export const isNull = (val: unknown): val is null => val === null;

export const isUndef = (val: unknown): val is undefined => typeof val === 'undefined';

export const isStrOrUndef = (val: unknown): val is string | undefined => isStr(val) || isUndef(val);

type UnknownFunc = (...args: unknown[]) => unknown;

export const isFunc = (val: unknown): val is UnknownFunc => {
  if (!val) return false;
  return Boolean({}.toString.call(val) === '[object Function]');
};

export const numOrUndef = (val?: string): number | undefined => (val ? parseInt(val, 10) : undefined);

export const select = <K extends string | number, T extends unknown>(key: K, data: Record<K, T>) => data[key];


export interface TelegraphAccount {
  /**
   * Account name, helps users with several accounts remember which they are currently using.
   * Displayed to the user above the "Edit/Publish" button on Telegra.ph, other users don't see this name.
   * */
  short_name: string;
  /** Default author name used when creating new articles. */
  author_name: string;
  /**
   * Profile link, opened when users click on the author's name below the title. Can be any link,
   * not necessarily to a Telegram profile or channel.
   * */
  author_url: string;
  /**
   * Optional. Only returned by the createAccount and revokeAccessToken method.
   * Access token of the Telegraph account.
   * */
  access_token?: string;
  /**
   * Optional. URL to authorize a browser on telegra.ph and connect it to a Telegraph account.
   * This URL is valid for only one use and for 5 minutes only.
   * */
  auth_url?: string;
  /** Optional. Number of pages belonging to the Telegraph account. */
  page_count?: number;
}

export type TelegraphAccountField = 'short_name' | 'author_name' | 'author_url' | 'auth_url' | 'page_count';

export const isTelegraphAccountField = (val: unknown): val is TelegraphAccountField =>
  isStr(val) && ['short_name', 'author_name', 'author_url', 'auth_url', 'page_count'].includes(val);

export interface TelegraphPageList {
  /** Total number of pages belonging to the target Telegraph account. */
  total_count: number;
  /** Requested pages of the target Telegraph account. */
  pages: TelegraphPage[];
}

export interface TelegraphPage {
  /** Path to the page */
  path: string;
  /** URL of the page */
  url: string;
  /** Title of the page */
  title: string;
  /** Description of the page */
  description: string;
  /** Name of the author, displayed below the title */
  author_name?: string;
  /**
   * Profile link, opened when users click on the author's name below the title.
   * Can be any link, not necessarily to a Telegram profile or channel
   */
  author_url?: string;
  /** Image URL of the page */
  image_url?: string;
  /** Content of the page */
  content?: TelegraphNode[];
  /** Number of page views for the page */
  views: number;
  /** Only returned if access_token passed. True, if the target Telegraph account can edit the page */
  can_edit?: boolean;
}

export interface TelegraphNode {
  /**
   * Name of the DOM element. Available tags:
   * `a`, `aside`, `b`, `blockquote`, `br`, `code`,
   * `em`, `figcaption`, `figure`, `h3`, `h4`, `hr`, `i`, `iframe`, `img`, `li`, `ol`,
   * `p`, `pre`, `s`, `strong`, `u`, `ul`, `video`.
   */
  tag: TelegraphNodeTag;
  /**
   * Attributes of the DOM element. Key of object represents name of attribute, value represents
   * value of attribute. Available attributes: `href`, `src`
   * */
  attrs?: Record<string, string>;
  children?: TelegraphChild[];
}

export type TelegraphNodeTag =
  | 'a'
  | 'aside'
  | 'b'
  | 'blockquote'
  | 'br'
  | 'code'
  | 'em'
  | 'figcaption'
  | 'figure'
  | 'h3'
  | 'h4'
  | 'hr'
  | 'i'
  | 'iframe'
  | 'img'
  | 'li'
  | 'ol'
  | 'p'
  | 'pre'
  | 's'
  | 'strong'
  | 'u'
  | 'ul'
  | 'video';

export type TelegraphChild = TelegraphNode | string;

export interface TelegraphPageViews {
  /** Number of page views for the target page. */
  views: number;
}

/**
 # Examples
 YoutTube with caption
 {
    "tag": "figure",
    "children": [
      {
        "tag": "iframe",
        "attrs": {
          "src": "/embed/youtube?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D6_CIolfOf3w%26t%3D185s",
          "width": "640",
          "height": "360",
          "frameborder": "0",
          "allowtransparency": "true",
          "allowfullscreen": "true",
          "scrolling": "no"
        }
      },
      {
        "tag": "figcaption",
        "children": [
          "Some caption"
        ]
      }
    ]
  }
 */