import { verify } from 'hono/jwt';
import { getCookie } from 'hono/cookie';
import crypto from 'node:crypto';
import { SESSION_PARAM, JWT_COOKIE_NAME } from './constants.js';
import { setCookieJwtToken, riseError } from './helpers.js';
import { getBase } from './crudLogic.js';

// const testData =
// 'query_id=AAHthjMbAAAAAO2GMxtBR4uf&user=%7B%22id%22%3A456361709%2C%22first_name%22%3A%22Ivan%20K%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22ivan_k_freedom%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1724709158&hash=91f97d9bc32282b06bc1880ff1c8fc71fa881bb3501f7e3e278546db3989992e';
// const testData =
// 	'query_id=AAHthjMbAAAAAO2GMxvrlpnx&user=%7B%22id%22%3A456361709%2C%22first_name%22%3A%22Ivan%20K%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22ivan_k_freedom%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1724711759&hash=c2a2e7cd4da9ed7b3221a2d40b487827809e13d676022d03974a1e47e9fdbb68';

// got from https://stackoverflow.com/questions/72010778/telegram-web-bots-data-validation-in-javascript
function validateTgUserData(apiToken, telegramInitData) {
	const initData = new URLSearchParams(telegramInitData);

	initData.sort();

	const hash = initData.get('hash');

	initData.delete('hash');

	const dataToCheck = [...initData.entries()].map(([key, value]) => key + '=' + value).join('\n');

	const secretKey = crypto.createHmac('sha256', 'WebAppData').update(apiToken).digest();

	const _hash = crypto.createHmac('sha256', secretKey).update(dataToCheck).digest('hex');

	return hash === _hash;
}

async function authInTg(c, tgAuth) {
	// create new JWT token - means first time in Telegram WebApp
	const parts = tgAuth.split(/\s+/);

	if (parts.length !== 2) throw riseError(401, `Unauthorized: Invalid Authorization header`);

	const telegramInitData = parts[1];

	if (validateTgUserData(c.env.TG_TOKEN, telegramInitData)) {
		throw riseError(401, `Unauthorized: Invalid Telegram WebApp data`);
	}

	const dataObj = new URLSearchParams(telegramInitData);
	const { id: tgUserId } = JSON.parse(dataObj.get('user'));
	// load user from db
	const res = await getBase(c, 'user', { tgUserId: String(tgUserId) });

	if (!('id' in res)) throw riseError(401, `Can't find user`);

	return {
		sub: res.id,
		azp: String(tgUserId),
	};
}

export function authMiddleware() {
	return async (c, next) => {
		const cookieJwtToken = getCookie(c, JWT_COOKIE_NAME);
		const tgAuth = c.req.raw.headers.get('Authorization');
		let payload;

		if (!cookieJwtToken && !tgAuth) {
			throw riseError(401, `Unauthorized: No any token`);
		} else if (!cookieJwtToken && tgAuth) {
			payload = await authInTg(c, tgAuth);
		} else {
			// parse jwtToken from cookie
			try {
				payload = await verify(cookieJwtToken, c.env.JWT_SECRET);
			} catch (e) {
				throw riseError(401, `Unauthorized: Wrong JWT token`);
			}
		}

		c.set(SESSION_PARAM, {
			userId: payload.sub,
			tgUserId: payload.azp,
		});

		await setCookieJwtToken(c, payload);

		return next();
	};
}

// return jwt({
// 	secret: c.env.JWT_SECRET,
// 	cookie: JWT_COOKIE_NAME,
// })(c, async () => {
// 	const payload = c.get('jwtPayload');
//
// 	c.set(SESSION_PARAM, {
// 		userId: payload.sub,
// 		tgUserId: payload.azp,
// 	});
//
// 	await setCookieJwtToken(c, payload);
//
// 	return next();
// });
