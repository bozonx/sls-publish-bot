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
