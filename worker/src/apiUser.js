import { Hono } from 'hono';
import { getBase, crudCreate, updateBase } from './crudLogic.js';
import { SESSION_PARAM } from './constants.js';
// import { zValidator } from '@hono/zod-validator';
// import { z } from 'zod';

const app = new Hono();
const tableName = 'user';

app.get('/me', async (c) => {
	const { sub: userId } = c.get(SESSION_PARAM);

	return c.json(await getBase(c, tableName, { id: userId }));
});

app.patch('/me', async (c) => {
	const { sub: userId } = c.get(SESSION_PARAM);
	const { id, ...data } = await c.req.json();

	return c.json(await updateBase(c, tableName, { id: userId }, data));
});

export default app;
