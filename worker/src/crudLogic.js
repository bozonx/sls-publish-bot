import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

const NOT_FOUD_RESULT = { message: 'Not found' };

export async function crudList(c, tableName) {
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });
	let result;

	try {
		result = await prisma[tableName].findMany();
	} catch (e) {
		c.status(500);

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
		c.status(500);

		return c.json({ error: String(e) });
	}

	if (!result) {
		c.status(404);

		return c.json(NOT_FOUD_RESULT);
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
		c.status(500);

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
		if (e.code === 'P2025') {
			// not found
			c.status(404);

			return c.json(NOT_FOUD_RESULT);
		}

		c.status(500);

		return c.json({ error: String(e) });
	}

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
		if (e.code === 'P2025') {
			// not found
			c.status(404);

			return c.json(NOT_FOUD_RESULT);
		}

		c.status(500);

		return c.json({ error: String(e) });
	}

	return c.json(result);
}
