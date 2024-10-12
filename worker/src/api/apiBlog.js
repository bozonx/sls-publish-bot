import { Hono } from 'hono';
import {
	crudList,
	crudGet,
	crudCreate,
	crudUpdate,
	crudDelete,
} from './crudLogic.js';

const app = new Hono();
const tableName = 'blog';

app.get('/', (c) =>
	crudList(c, tableName, {
		// relationLoadStrategy: 'query', // or 'query' , join
		// include: {
		// 	workspace: true,
		// },
	}),
);
app.get('/:id', (c) => crudGet(c, tableName));
app.post('/', (c) => crudCreate(c, tableName));
app.patch('/', (c) => crudUpdate(c, tableName));
app.delete('/:id', (c) => crudDelete(c, tableName));

export default app;
