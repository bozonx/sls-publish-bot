// for webhook
export const TG_BOT_URL = '/bot';
export const CACHE_PREFIX = 'CACHE';
export const CACHE_MENU_MSG_ID_TTL_SEC = 80;
export const CACHE_STATE_TTL_SEC = 80;
export const USER_SENT_TO_ADMIN_MSG_DELIMITER = '-----';
export const KV_KEYS = {
	USERS: 'USERS',
	TAGS: 'TAGS',
	CONFIG: 'CONFIG',
};
export const CTX_KEYS = {
	CONFIG: 'CONFIG',
	USERS: 'USERS',
	KV: 'KV',
};
export const USER_KEYS = {
	ID: 'ID',
	NAME: 'NAME',
	IS_ADMIN: 'IS_ADMIN',
};
export const APP_CFG_KEYS = {
	AUTHORS: 'AUTHORS',
	TEMPLATES: 'TEMPLATES',
};
export const TEMPLATE_NAMES = {
	default: 'default',
	byFollower: 'byFollower',
	noFooter: 'noFooter',
};
export const STATE_KEYS = {
	author: 'author',
	// TODO: add more
};
// TODO: review
export const DEFAULT_STATE = {
	preview: true,
	template: TEMPLATE_NAMES.default,
};

const footer =
	'[Антифеминизм | Маскулизм. подписывайся](https://t.me/antifem_battle) | [донат](https://t.me/antifem_battle/78)';

export const APP_INITIAL_CONFIG = {
	[APP_CFG_KEYS.AUTHORS]: ['Айван Кей'],
	[APP_CFG_KEYS.TEMPLATES]: {
		[TEMPLATE_NAMES.common]: ['${CONTENT}', '${AUTHOR}', '${TAGS}', footer],
		[TEMPLATE_NAMES.byFollower]: [
			'От подписчика ${AUTHOR}:',
			'${CONTENT}',
			'${TAGS}',
			footer,
		],
		[TEMPLATE_NAMES.noFooter]: ['${CONTENT}', '${AUTHOR}', '${TAGS}'],
	},
};
