import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { keysToCammelCase, normalizeNumbers } from './helpers.js';
import { SESSION_PARAM } from './constants.js';

const NOT_FOUD_RESULT = { message: 'Not found' };

export async function crudList(c, tableName) {
	const { sub: userId } = c.get(SESSION_PARAM);
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });
	let result;

	try {
		result = await prisma[tableName].findMany({
			where: {
				...keysToCammelCase(normalizeNumbers(c.req.query())),
				createdByUserId: userId,
			},
		});
	} catch (e) {
		c.status(500);

		return c.json({ error: String(e) });
	}

	return c.json(result);
}

export async function crudGet(c, tableName) {
	const { sub: userId } = c.get(SESSION_PARAM);

	return c.json(
		await getBase(c, tableName, {
			id: Number(c.req.param().id),
			// TODO: get from session
			createdByUserId: userId,
		}),
	);
}

export async function crudCreate(c, tableName) {
	const { sub: userId } = c.get(SESSION_PARAM);
	const { id, createdByUserId, ...data } = await c.req.json();

	return c.json(
		await createBase(c, tableName, {
			...data,
			createdByUserId: userId,
		}),
	);
}

export async function crudUpdate(c, tableName) {
	const { sub: userId } = c.get(SESSION_PARAM);
	const { createdByUserId, ...data } = await c.req.json();

	return c.json(
		await updateBase(c, tableName, data, {
			id: Number(data.id),
			createdByUserId: userId,
		}),
	);
}

export async function crudDelete(c, tableName) {
	const { sub: userId } = c.get(SESSION_PARAM);
	const { id } = c.req.param();
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });
	let result;

	try {
		result = await prisma[tableName].delete({
			where: {
				id: Number(id),
				createdByUserId: userId,
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

export async function getBase(c, tableName, where) {
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });
	let result;

	try {
		result = await prisma[tableName].findUnique({ where });
	} catch (e) {
		c.status(500);

		return { error: String(e) };
	}

	if (!result) {
		c.status(404);

		return NOT_FOUD_RESULT;
	}

	return result;
}

export async function createBase(c, tableName, data) {
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });
	let result;

	try {
		result = await prisma[tableName].create({ data });
	} catch (e) {
		c.status(500);

		return { error: String(e) };
	}

	c.status(201);

	return result;
}

export async function updateBase(c, tableName, data, where) {
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

			return NOT_FOUD_RESULT;
		}

		c.status(500);

		return { error: String(e) };
	}

	return result;
}
