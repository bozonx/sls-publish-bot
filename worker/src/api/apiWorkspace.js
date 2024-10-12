import { Hono } from 'hono';
import {
	crudList,
	crudGet,
	crudCreate,
	crudUpdate,
	crudDelete,
} from './crudLogic.js';

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
app.post('/', (c) => crudCreate(c, tableName));
app.patch('/', (c) => crudUpdate(c, tableName));
app.delete('/:id', (c) => crudDelete(c, tableName));

export default app;
