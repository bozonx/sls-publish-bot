// for webhook
export const TG_BOT_URL = '/bot';
export const KV_KEYS = {
	USERS: 'USERS',
	TAGS: 'TAGS',
	CONFIG: 'CONFIG',
};
export const CTX_KEYS = {
	APP_CFG: 'APP_CFG',
	USERS: 'USERS',
	KV: 'KV',
};
export const USER_KEYS = {
	ID: 'ID',
	NAME: 'NAME',
	IS_ADMIN: 'IS_ADMIN',
};
export const APP_CONFIG_KEYS = {
	AUTHORS: 'AUTHORS',
	TEMPLATES: 'TEMPLATES',
};
export const TEMPLATE_NAMES = {
	default: 'default',
	byFollower: 'byFollower',
	noFooter: 'noFooter',
};
export const DEFAULT_STATE = {
	preview: true,
	template: TEMPLATE_NAMES.default,
};

const footer =
	'[Антифеминизм | Маскулизм. подписывайся](https://t.me/antifem_battle) | [донат](https://t.me/antifem_battle/78)';

export const APP_INITIAL_CONFIG = {
	[APP_CONFIG_KEYS.AUTHORS]: ['Айван Кей'],
	[APP_CONFIG_KEYS.TEMPLATES]: {
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
