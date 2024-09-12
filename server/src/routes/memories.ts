import { prisma } from "../lib/prisma";
import { z } from "zod";
import type { FastifyInstance } from "fastify";

export async function memoriesRoutes(app: FastifyInstance) {
	app.addHook("preHandler", async (request) => {
		await request.jwtVerify();
	});

	app.get("/memories", async (request) => {
		const memories = await prisma.memory.findMany({
			where: {
				userId: request.user.sub,
			},
			orderBy: {
				createdAt: "asc",
			},
		});

		return memories.map((memory) => ({
			id: memory.id,
			coverUrl: memory.coverUrl,
			excerpt: memory.content.substring(0, 115).concat("..."),
			isPublic: memory.isPublic,
			createdAt: memory.createdAt,
			userId: memory.userId,
		}));
	});

	app.get("/memories/:id", async (request, reply) => {
		const parmasSchema = z.object({
			id: z.string().uuid(),
		});
		const { id } = parmasSchema.parse(request.params);
		const memory = await prisma.memory.findUniqueOrThrow({
			where: {
				id,
			},
		});

		if (!memory.isPublic && memory.userId !== request.user.sub) {
			return reply.status(404).send();
		}

		return memory;
	});

	app.post("/memories", async (request) => {
		const bodySchema = z.object({
			content: z.string(),
			coverUrl: z.string(),
			isPublic: z.coerce.boolean().default(false),
		});
		const { content, isPublic, coverUrl } = bodySchema.parse(request.body);
		const memory = await prisma.memory.create({
			data: {
				content,
				coverUrl,
				isPublic,
				userId: request.user.sub,
			},
		});
		return memory;
	});

	app.put("/memories/:id", async (request, reply) => {
		const parmasSchema = z.object({
			id: z.string().uuid(),
		});

		const { id } = parmasSchema.parse(request.params);

		const bodySchema = z.object({
			content: z.string(),
			coverUrl: z.string(),
			isPublic: z.coerce.boolean().default(false),
		});
		const { content, isPublic, coverUrl } = bodySchema.parse(request.body);

		const existingMemory = await prisma.memory.findUniqueOrThrow({
			where: {
				id,
			},
		});

		if (existingMemory.userId !== request.user.sub) {
			return reply.status(404).send();
		}

		const updatedMemory = await prisma.memory.update({
			where: {
				id,
			},
			data: {
				content,
				coverUrl,
				isPublic,
			},
		});
		return updatedMemory;
	});

	app.delete("/memories/:id", async (request, reply) => {
		const parmasSchema = z.object({
			id: z.string().uuid(),
		});
		const { id } = parmasSchema.parse(request.params);

		const existingMemory = await prisma.memory.findUniqueOrThrow({
			where: {
				id,
			},
		});

		if (existingMemory.userId !== request.user.sub) {
			return reply.status(403).send();
		}
		await prisma.memory.delete({
			where: {
				id,
			},
		});
		return reply.status(204).send();
	});
}
