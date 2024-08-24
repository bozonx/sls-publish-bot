import { Hono } from 'hono';
import { getBase, crudCreate, updateBase } from './crudLogic.js';
// import { zValidator } from '@hono/zod-validator';
// import { z } from 'zod';

const app = new Hono();
const tableName = 'user';

app.get('/me', async (c) => {
	// TODO: get from session
	return getBase(tableName, { id: 1 });
});

// TODO: secure for telegram only
app.get('/by-tg-id/:id', async (c) => {
	return getBase(tableName, { tgUserId: 1 });
});

// TODO: secure for telegram only
app.post('/', (c) => crudCreate(c, tableName, false));

app.patch('/me', (c) => async (c) => {
	// TODO: get from session
	return updateBase(tableName, { id: 1 }, await c.req.json());
});

export default app;
