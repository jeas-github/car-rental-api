import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import {
   validatorCompiler,
   serializerCompiler,
   ZodTypeProvider,
   jsonSchemaTransform,
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import adminPlugin from "@/plugins/admin";
import routesPlugin from "@/plugins/routes-plugin";

import { ZodError } from "zod";
import { ResourceNotFoundError } from "./modules/shared/errors/resource-not-found-error";
import { RentalPointAlreadyExistsError } from "./modules/rental-points/use-cases/errors/rental-point-already-exists-error";
import { CarAlreadyExistsError } from "./modules/cars/use-cases/errors/car-already-exists-error";
import { ClientAlreadyExistsError } from "./modules/clients/use-cases/erros/client-already-exists-error";
import { CarNotAvailableError } from "./modules/rentals/use-cases/errors/car-not-available-error";
import { ClientHasOpenRentalError } from "./modules/rentals/use-cases/errors/client-has-open-rental-error";
import { RentalAlreadyFinishedError } from "./modules/rentals/use-cases/errors/rental-already-finished-error";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const errorMapping = new Map<Function, number>([
  [ResourceNotFoundError, 404],
  [RentalPointAlreadyExistsError, 409],
  [CarAlreadyExistsError, 409],
  [ClientAlreadyExistsError, 409],
  [CarNotAvailableError, 409],
  [ClientHasOpenRentalError, 409],
  [RentalAlreadyFinishedError, 409],
]);

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: "*" });
app.register(adminPlugin);

app.register(fastifySwagger, {
   openapi: {
      info: {
         title: "Car Rental API",
         description: "API for managing car rentals",
         version: "1.0.0",
      },
   },
   transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
   routePrefix: "/docs",
});

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Erro de validação.",
      issues: error.format(),
    });
  }

  const statusCode = errorMapping.get(error.constructor);
  if (statusCode) {
    return reply.status(statusCode).send({ message: error.message });
  }

  return reply.status(500).send({ message: "Erro interno do servidor." });
});

app.register(routesPlugin);

app.get("/", async (request, reply) => {
   reply.type("text/html; charset=utf-8").send(`
    <h1>Seja Bem Vindo à API de Locação de Veículos!</h1>
    <h2>Explore os Recursos Disponíveis:</h2>
    <ul>
      <li><strong>HTTP Server Running!</strong><a href="/">${request.hostname}</a></li>
      <br>
      <li><strong>HTTP AdminJS Server Running!</strong> <a href="/admin">${request.hostname}/admin</a></li>
      <br>
      <li><strong>HTTP OpenAPI Server Running!</strong> <a href="/docs">${request.hostname}/docs</a></li>
    </ul>
  `);
});
