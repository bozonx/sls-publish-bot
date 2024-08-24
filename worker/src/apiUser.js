import { Hono } from 'hono';
import { getBase, crudCreate, updateBase } from './crudLogic.js';
import { API_CALL_LOCAL_CODE } from './constants.js';
// import { zValidator } from '@hono/zod-validator';
// import { z } from 'zod';

const app = new Hono();
const tableName = 'user';

app.get('/me', async (c) => {
	// TODO: get from session
	return getBase(tableName, { id: 1 });
});

app.get('/by-tg-id/:tgid', async (c) => {
	const { code } = c.req.query();

	if (code !== API_CALL_LOCAL_CODE) {
		c.status(403);

		return c.json({ message: 'Secured' });
	}

	const res = await getBase(tableName, { tgUserId: c.req.param().tgid });

	if ('id' in res) return { id: res.id };
	else return res;
});

app.post('/', (c) => {
	const { code } = c.req.query();

	if (code !== API_CALL_LOCAL_CODE) {
		c.status(403);

		return c.json({ message: 'Secured' });
	}

	return crudCreate(c, tableName, false);
});

app.patch('/me', (c) => async (c) => {
	// TODO: get from session
	return updateBase(tableName, { id: 1 }, await c.req.json());
});

export default app;
