import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { keysToCammelCase, normalizeNumbers } from './helpers.js';

const NOT_FOUD_RESULT = { message: 'Not found' };

export async function crudList(c, tableName) {
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });
	let result;

	try {
		result = await prisma[tableName].findMany({
			where: {
				...keysToCammelCase(normalizeNumbers(c.req.query())),
				// TODO: get from session
				createdByUserId: 1,
			},
		});
	} catch (e) {
		c.status(500);

		return c.json({ error: String(e) });
	}

	return c.json(result);
}

export async function crudGet(c, tableName) {
	return getBase(tableName, {
		id: c.req.param().id,
		// TODO: get from session
		createdByUserId: 1,
	});
}

export async function crudCreate(c, tableName, secure = true) {
	const { id, createdByUserId, data } = await c.req.json();
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });
	let result;

	try {
		result = await prisma[tableName].create({
			data: {
				...data,
				// TODO: get from session
				createdByUserId: secure ? 1 : undefined,
			},
		});
	} catch (e) {
		c.status(500);

		return c.json({ error: String(e) });
	}

	c.status(201);

	return c.json(result);
}

export async function crudUpdate(c, tableName) {
	const rawData = await c.req.json();

	return updateBase(
		tableName,
		{
			id: Number(rawData.id),
			// TODO: get from session
			createdByUserId: 1,
		},
		rawData,
	);
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
				// TODO: get from session
				createdByUserId: 1,
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

export async function getBase(tableName, where) {
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });
	let result;

	try {
		result = await prisma[tableName].findUnique({ where });
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

export async function updateBase(tableName, where, rawData) {
	const { id, createdByUserId, data } = rawData;
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });
	let result;

	try {
		result = await prisma[tableName].update({
			where,
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
