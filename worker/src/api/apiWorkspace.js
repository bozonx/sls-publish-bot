import { Hono } from 'hono';
import {
	crudList,
	crudGet,
	crudUpdate,
	crudDelete,
	createBase,
} from './crudLogic.js';
import { SESSION_PARAM } from './constants.js';

const app = new Hono();
const tableName = 'workspace';

app.get('/', (c) =>
	crudList(c, tableName, {
		// relationLoadStrategy: 'query', // or 'query' , join
		// include: {
		// 	createdByUser: true,
		// },
		// select: {
		// 	createdByUser: {
		// 		select: {
		// 			name: true,
		// 		},
		// 	},
		// },
	}),
);
app.get('/:id', (c) => crudGet(c, tableName));
app.post('/', async (c) => {
	const { userId } = c.get(SESSION_PARAM);
	const { id, byUserId, ...data } = await c.req.json();

	return c.json(
		await createBase(c, tableName, {
			...data,
			byUserId: userId,
		}),
	);
});
app.patch('/', (c) => crudUpdate(c, tableName));
app.delete('/:id', (c) => crudDelete(c, tableName));

export default app;
