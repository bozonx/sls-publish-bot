import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { crudList, crudGet, crudCreate, crudUpdate, crudDelete } from './crudLogic.js';
// import { zValidator } from '@hono/zod-validator';
// import { z } from 'zod';

const app = new Hono();
const tableName = 'user';

app.get('/', (c) => crudList(c, tableName));
app.get('/:id', (c) => crudGet(c, tableName));
app.post('/', (c) => crudCreate(c, tableName));
app.patch('/:id', (c) => crudUpdate(c, tableName));
app.delete('/:id', (c) => crudDelete(c, tableName));

app.get('/by-tg-id/:id', async (c) => {
	const { id } = c.req.param();
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });
	let result;

	try {
		result = await prisma[tableName].findUnique({
			where: {
				tgUserId: id,
			},
		});
	} catch (e) {
		c.status(400);

		return c.json({ error: String(e) });
	}

	if (!result) {
		c.status(404);

		return c.json({ message: 'Not found' });
	}

	return c.json(result);
});

export default app;
