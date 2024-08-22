import { Hono } from 'hono';
import { crudList, crudGet, crudCreate, crudUpdate, crudDelete } from './crudLogic.js';
// import { zValidator } from '@hono/zod-validator';
// import { z } from 'zod';

const app = new Hono();
const tableName = 'inbox';

app.get('/', (c) => crudList(c, tableName));
app.get('/:id', (c) => crudGet(c, tableName));
app.post('/', (c) => crudCreate(c, tableName));
app.patch('/:id', (c) => crudUpdate(c, tableName));
app.delete('/:id', (c) => crudDelete(c, tableName));

export default app;
