export const CACHE_PREFIX = 'CACHE';
export const QUERY_MARKER = 'PageRouter';
export const SESSION_CACHE_NAME = 'session';
export const DEFAULT_BTN_ITEM_ID = '-BTN=';
export const TG_HOME_PAGE = 'tg-manager-home';
export const MAIN_HOME = 'home';
export const EDIT_ITEM_NAME = 'editItem';
// export const DEFAULT_SOCIAL_MEDIA = 'telegram';
export const MENU_ITEM_LABEL_LENGTH = 40;
export const PUBLICATION_ADD_NOW_SEC = 5;
export const DEFAULT_PUB_PLUS_DAY = 1;
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
	// user object from DB
	me: 'me',
	KV: 'KV',
	DB_CRUD: 'DB_CRUD',
	WEB_APP_URL: 'WEB_APP_URL',
	BOT_SESSION_TTL_DAYS: 'BOT_SESSION_TTL_DAYS',
	APP_DEBUG: 'APP_DEBUG',
	TEST_MODE: 'TEST_MODE',
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
	pubTimestampMinutes: 'pubTimestampMinutes',
	publicatedData: 'publicatedData',
	payloadJson: 'payloadJson',
	// pubMsgId: 'pubMsgId',
	createdByUserId: 'createdByUserId',
	updatedByUserId: 'updatedByUserId',
	forcePublishedByUserId: 'forcePublishedByUserId',
	changedTimeByUserId: 'changedTimeByUserId',
};
export const SM_KEYS = {
	id: 'id',
	name: 'name',
	cfg: 'cfg',
	blog: 'blog',
};
export const TAG_KEYS = {
	id: 'id',
	name: 'name',
	socialMediaId: 'socialMediaId',
	blogId: 'blogId',
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
	// TODO: remove
	authorName: 'authorName',
	permissions: 'permissions',
};
// TODO: specified for tg bot
export const USER_PERMISSIONS_KEYS = {
	admin: 'admin',
	editOthersScheduledPub: 'editOthersScheduledPub',
	deleteOthersScheduledPub: 'deleteOthersScheduledPub',
};
export const SM_CONFIG_KEYS = {
	// MAIN_ADMIN_TG_USER_ID: 'MAIN_ADMIN_TG_USER_ID',
	CHAT_OF_ADMINS_ID: 'CHAT_OF_ADMINS_ID',
	DESTINATION_CHANNEL_ID: 'DESTINATION_CHANNEL_ID',
	DESTINATION_CHANNEL_NAME: 'DESTINATION_CHANNEL_NAME',
	PUBLICATION_TIME_ZONE: 'PUBLICATION_TIME_ZONE',
	PUBLISHING_MINUS_MINUTES: 'PUBLISHING_MINUS_MINUTES',
	DEFAULT_PUB_TIME: 'DEFAULT_PUB_TIME',
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
	// data of DB record
	dbRecord: 'dbRecord',
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
