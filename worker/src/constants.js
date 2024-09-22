// for webhook
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
export const CTX_KEYS = {
	// config: 'config',
	session: 'session',
	// user object from DB
	me: 'me',
	KV: 'KV',
	DB_CRUD: 'DB_CRUD',
	WEB_APP_URL: 'WEB_APP_URL',
	SESSION_STATE_TTL_DAYS: 'SESSION_STATE_TTL_DAYS',
	APP_DEBUG: 'APP_DEBUG',
	TEST_MODE: 'TEST_MODE',
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
