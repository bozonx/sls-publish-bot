// for webhook
export const TG_BOT_URL = '/bot';
export const CACHE_PREFIX = 'CACHE';
export const QUERY_MARKER = 'PageRouter';
// export const CACHE_MENU_MSG_ID_TTL_SEC = 80;
export const SESSION_STATE_TTL_SEC = 80;
export const USER_SENT_TO_ADMIN_MSG_DELIMITER = '-----';
export const KV_KEYS = {
	config: 'config',
	users: 'users',
	tags: 'tags',
	scheduled: 'scheduled',
};
export const CTX_KEYS = {
	config: 'config',
	users: 'users',
	me: 'me',
	KV: 'KV',
	CHAT_OF_ADMINS_ID: 'CHAT_OF_ADMINS_ID',
	DESTINATION_CHANNEL_ID: 'DESTINATION_CHANNEL_ID',
};
export const USER_KEYS = {
	id: 'id',
	name: 'name',
	isAdmin: 'isAdmin',
};
export const APP_CFG_KEYS = {
	authors: 'authors',
	templates: 'templates',
};
export const TEMPLATE_NAMES = {
	default: 'default',
	byFollower: 'byFollower',
	noFooter: 'noFooter',
};
export const PUB_KEYS = {
	text: 'text',
	photo: 'photo',
	video: 'video',
	entities: 'entities',
	author: 'author',
	tags: 'tags',
	template: 'template',
	preview: 'preview',
	date: 'date',
	hour: 'hour',
	publisher: 'publisher',
};
export const MEDIA_TYPES = {
	photo: 'photo',
	video: 'video',
	file: 'file',
};

export const DEFAULT_SETUP_STATE = {
	[PUB_KEYS.preview]: true,
	[PUB_KEYS.template]: TEMPLATE_NAMES.default,
};

const footer =
	'[Антифеминизм \\| Маскулизм\\. подписывайся](https://t.me/antifem_battle) \\| [донат](https://t.me/antifem_battle/78)';

export const APP_INITIAL_CONFIG = {
	[APP_CFG_KEYS.authors]: ['Айван Кей'],
	// use telegram MarkdownV2 https://core.telegram.org/bots/api#markdownv2-style
	[APP_CFG_KEYS.templates]: {
		[TEMPLATE_NAMES.default]: ['${CONTENT}', '${AUTHOR}', '${TAGS}', footer],
		[TEMPLATE_NAMES.byFollower]: [
			'От подписчика ${AUTHOR}:',
			'${CONTENT}',
			'${TAGS}',
			footer,
		],
		[TEMPLATE_NAMES.noFooter]: ['${CONTENT}', '${AUTHOR}', '${TAGS}'],
	},
};
