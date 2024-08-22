import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { TG_BOT_URL } from './constants.js';

export async function setWebhook(env) {
	const url = `https://api.telegram.org/bot${env.TG_TOKEN}/setWebhook?url=https://${env.WORKER_HOST}${TG_BOT_URL}`;

	return fetch(url);
}

export async function crudList(c, tableName) {
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });
	let result;

	try {
		result = await prisma[tableName].findMany();
	} catch (e) {
		c.status(400);

		return c.json({ error: String(e) });
	}

	return c.json(result);
}

export async function crudGet(c, tableName) {
	const { id } = c.req.param();
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });
	let result;

	try {
		result = await prisma[tableName].findUnique({
			where: {
				id: Number(id),
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
}

export async function crudCreate(c, tableName) {
	const data = await c.req.json();
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });
	let result;

	try {
		result = await prisma[tableName].create({ data });
	} catch (e) {
		c.status(400);

		return c.json({ error: String(e) });
	}

	c.status(201);

	return c.json(result);
}

export async function crudUpdate(c, tableName) {
	const { id } = c.req.param();
	const data = await c.req.json();
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });
	let result;

	try {
		result = await prisma[tableName].update({
			where: {
				id: Number(id),
			},
			data,
		});
	} catch (e) {
		c.status(400);

		return c.json({ error: String(e) });
	}

	// TODO: что если не найдено???

	return c.json(result);
}

export async function crudDelete(c, tableName) {
	const { id } = c.req.param();
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });
	let result;

	try {
		result = await prisma[tableName].delete({
			where: {
				id: Number(id),
			},
		});
	} catch (e) {
		c.status(400);

		return c.json({ error: String(e) });
	}

	// TODO: что если не найдено???

	return c.json(result);
}
