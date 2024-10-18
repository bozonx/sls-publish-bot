import { Hono } from 'hono';
import { getBase, updateBase } from './crudLogic.js';
import { SESSION_PARAM } from './constants.js';

const app = new Hono();
const tableName = 'user';

app.get('/me', async (c) => {
	const { userId } = c.get(SESSION_PARAM);

	return c.json(await getBase(c, tableName, { id: userId }));
});

app.patch('/me', async (c) => {
	const { userId } = c.get(SESSION_PARAM);
	const { id: excludedId, ...data } = await c.req.json();

	return c.json(await updateBase(c, tableName, data, { id: userId }));
});

export default app;
