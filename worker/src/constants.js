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
// TODO: move to secrets
// code for calling from tg bot to secure api
export const API_CALL_LOCAL_CODE = 'cp29t9kerg3rxsfqb';
