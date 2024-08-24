import { Hono } from 'hono';
import { crudList, crudGet, crudCreate, crudUpdate, crudDelete } from './crudLogic.js';
import { API_CALL_LOCAL_CODE } from './constants.js';
// import { zValidator } from '@hono/zod-validator';
// import { z } from 'zod';

const app = new Hono();
const tableName = 'inbox';

app.get('/', (c) => crudList(c, tableName));
app.get('/:id', (c) => crudGet(c, tableName));
app.post('/', (c) => crudCreate(c, tableName));
app.patch('/', (c) => crudUpdate(c, tableName));
app.delete('/:id', (c) => crudDelete(c, tableName));

app.post('/frombot', (c) => {
	const { code } = c.req.query();

	if (code !== API_CALL_LOCAL_CODE) {
		c.status(403);

		return c.json({ message: 'Secured' });
	}

	return crudCreate(c, tableName, false);
});

export default app;
