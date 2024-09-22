// for webhook
// export const TG_BOT_URL = '/bot';
export const TG_BOT_URL = '/bot';
export const SESSION_PARAM = 'SESSION_PARAM';
export const JWT_COOKIE_NAME = 'apisessid';
export const AUTH_COOKIE_BASE_PARAMS = {
	path: '/api/auth',
	secure: true,
	httpOnly: true,
	// better to use Strict
	// sameSite: 'Lax',
	sameSite: 'None',
};

export const CACHE_PREFIX = 'CACHE';
export const QUERY_MARKER = 'PageRouter';
export const SESSION_CACHE_NAME = 'session';
export const DEFAULT_BTN_ITEM_ID = '-BTN=';
export const HOME_PAGE = 'tg-manager-home';
export const EDIT_ITEM_NAME = 'editItem';
// export const DEFAULT_SOCIAL_MEDIA = 'telegram';
export const MENU_ITEM_LABEL_LENGTH = 40;
export const PUBLICATION_ADD_NOW_SEC = 5;
export const DEFAULT_PUB_PLUS_DAY = 1;
export const DEFAULT_PUB_TIME = '10:00';
// export const USER_SENT_TO_ADMIN_MSG_DELIMITER = '-----';
export const MAX_MEDIA_COUNT = 10;
export const MAX_CAPTION_LENGTH = 1024;
export const MAX_TEXT_POST_LENGTH = 4096;
// export const KV_KEYS = {
// 	config: 'config',
// };
// export const APP_CFG_KEYS = {
// 	templates: 'templates',
// };
export const TEMPLATE_NAMES = {
	default: 'default',
	byFollower: 'byFollower',
	noFooter: 'noFooter',
	gotFrom: 'gotFrom',
};

export const CTX_KEYS = {
	// session state from db
	session: 'session',
	// selected telegram social media from db
	tgSm: 'tgSm',
	// user object from DB
	me: 'me',
	KV: 'KV',
	DB_CRUD: 'DB_CRUD',
	WEB_APP_URL: 'WEB_APP_URL',
	BOT_SESSION_TTL_DAYS: 'BOT_SESSION_TTL_DAYS',
	APP_DEBUG: 'APP_DEBUG',
	TEST_MODE: 'TEST_MODE',
	// config: 'config',
	// MAIN_ADMIN_TG_USER_ID: 'MAIN_ADMIN_TG_USER_ID',
	// CHAT_OF_ADMINS_ID: 'CHAT_OF_ADMINS_ID',
	// DESTINATION_CHANNEL_ID: 'DESTINATION_CHANNEL_ID',
	// DESTINATION_CHANNEL_NAME: 'DESTINATION_CHANNEL_NAME',
	// PUBLICATION_TIME_ZONE: 'PUBLICATION_TIME_ZONE',
	// PUBLISHING_MINUS_MINUTES: 'PUBLISHING_MINUS_MINUTES',
};
export const USER_KEYS = {
	id: 'id',
	tgUserId: 'tgUserId',
	tgChatId: 'tgChatId',
	name: 'name',
	cfg: 'cfg',
	lang: 'lang',
};
export const POST_KEYS = {
	id: 'id',
	name: 'name',
	socialMedia: 'socialMedia',
	pubTimestampMinutes: 'pubTimestampMinutes',
	pubMsgId: 'pubMsgId',
	createdByUserId: 'createdByUserId',
	updatedByUserId: 'updatedByUserId',
	payloadJson: 'payloadJson',
};
export const SOCIAL_MEDIA_KEYS = {
	id: 'id',
	name: 'name',
	cfg: 'cfg',
};
export const DB_TABLE_NAMES = {
	User: 'User',
	Workspace: 'Workspace',
	Blog: 'Blog',
	SocialMedia: 'SocialMedia',
	Tag: 'Tag',
	Post: 'Post',
};

export const USER_CFG_KEYS = {
	authorName: 'authorName',
	permissions: 'permissions',
};
export const USER_PERMISSIONS_KEYS = {
	admin: 'admin',
	editOthersScheduledPub: 'editOthersScheduledPub',
	deleteOthersScheduledPub: 'deleteOthersScheduledPub',
};
export const TAG_KEYS = {
	id: 'id',
	name: 'name',
	socialMedia: 'socialMedia',
};
export const PUB_KEYS = {
	// telegram html
	textHtml: 'textHtml',
	media: 'media',
	media_group_id: 'media_group_id',
	tags: 'tags',
	template: 'template',
	previewLink: 'previewLink',
	previewLinkOnTop: 'previewLinkOnTop',
	// the final selected author
	author: 'author',
	// obviously do not use author
	noAuthor: 'noAuthor',
	// author name which has been inputted
	customAuthor: 'customAuthor',
	// name of tg user of forwarded message
	forwardedFrom: 'forwardedFrom',
	date: 'date',
	time: 'time',
	// data or DB record
	dbRecord: 'dbRecord',
	// who forcely published this post
	forcePublishedByUserName: 'forcePublishedByUserName',
	// who updated time
	chandedTimeByUserName: 'chandedTimeByUserName',
};
export const MEDIA_TYPES = {
	photo: 'photo',
	video: 'video',
};
export const DEFAULT_SETUP_STATE = {
	[PUB_KEYS.previewLinkOnTop]: false,
	[PUB_KEYS.previewLink]: null,
	[PUB_KEYS.template]: TEMPLATE_NAMES.default,
};

const footer =
	'<a href="https://t.me/antifem_battle">Антифеминизм | Маскулизм. подписывайся</a> | <a href="https://t.me/antifem_battle/78">донат</a>';
// '[Антифеминизм \\| Маскулизм\\. подписывайся](https://t.me/antifem_battle) \\| [донат](https://t.me/antifem_battle/78)';

export const APP_INITIAL_CONFIG = {
	// use telegram MarkdownV2 https://core.telegram.org/bots/api#markdownv2-style
	[APP_CFG_KEYS.templates]: {
		[TEMPLATE_NAMES.default]: [
			'${CONTENT}\n\n',
			'${AUTHOR}\n\n',
			'${TAGS}\n\n',
			footer,
		],
		[TEMPLATE_NAMES.byFollower]: [
			'От подписчика',
			' ${AUTHOR}',
			'\n\n${CONTENT}',
			'\n\n${TAGS}',
			'\n\n' + footer,
		],
		[TEMPLATE_NAMES.gotFrom]: [
			'${CONTENT}\n\n',
			'Взято из ${AUTHOR}\n\n',
			'${TAGS}\n\n',
			footer,
		],
		[TEMPLATE_NAMES.noFooter]: ['${CONTENT}\n\n', '${AUTHOR}\n\n', '${TAGS}'],
	},
};
