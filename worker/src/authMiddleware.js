import { jwt } from 'hono/jwt';
import crypto from 'node:crypto';
import { SESSION_PARAM } from './constants.js';
import { setCookieJwtToken } from './helpers.js';

export function authMiddleware() {
	return async (c, next) => {
		// TODO: 	authorize via tg

		// console.log(1111, c.req);

		// TODO: надо возвращать json при ошибке
		return jwt({
			secret: c.env.JWT_SECRET,
			// cookie: JWT_COOKIE_NAME,
		})(c, async () => {
			const payload = c.get('jwtPayload');
			c.set(SESSION_PARAM, {
				userId: payload.sub,
				tgUserId: payload.azp,
			});

			await setCookieJwtToken(c, payload);

			return next();
		});
	};
}
