import "dotenv/config";

import fastify from "fastify";
import { memoriesRoutes } from "./routes/memories";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import { authRoutes } from "./routes/auth";
import { uploadRoutes } from "./routes/upload";
import fastifyStatic from "@fastify/static";
import { resolve } from "node:path";

const app = fastify();

app.register(multipart);

app.register(fastifyStatic, {
	root: resolve(__dirname, "../uploads"),
	prefix: "/uploads",
});

app.register(cors, {
	origin: true, //Todas URLs de frontend podem acessar o servidor
});

app.register(jwt, {
	secret: "spacetime",
});

app.register(uploadRoutes);
app.register(memoriesRoutes);
app.register(authRoutes);

app
	.listen({
		port: 3333,
	})
	.then(() => {
		console.log("Server is running on http://localhost:3333");
	});
