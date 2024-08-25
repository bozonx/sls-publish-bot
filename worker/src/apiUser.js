import { Hono } from 'hono';
import { getBase, crudCreate, updateBase } from './crudLogic.js';
// import { zValidator } from '@hono/zod-validator';
// import { z } from 'zod';

const app = new Hono();
const tableName = 'user';

app.get('/me', async (c) => {
	// TODO: get from session
	return c.json(await getBase(c, tableName, { id: 1 }));
});

app.patch('/me', async (c) => {
	const { id, ...data } = await c.req.json();

	// TODO: get from session
	return c.json(await updateBase(c, tableName, { id: 1 }, data));
});

export default app;
