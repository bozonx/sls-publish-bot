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

	const res = await getBase(c, tableName, { tgUserId: c.req.param().tgid });

	if ('id' in res) return c.json({ id: res.id });
	else return c.json(res);
});

app.post('/frombot', async (c) => {
	const { code } = c.req.query();

	if (code !== API_CALL_LOCAL_CODE) {
		c.status(403);

		return c.json({ message: 'Secured' });
	}

	return c.json(await createBase(c, tableName, await c.req.json()));
});

app.patch('/me', (c) => async (c) => {
	const { id, data } = await c.req.json();

	// TODO: get from session
	return c.json(await updateBase(c, tableName, { id: 1 }, data));
});

export default app;
