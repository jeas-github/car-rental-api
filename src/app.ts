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

  // Adicione aqui outros erros customizados
  if (error instanceof ResourceNotFoundError) {
    return reply.status(404).send({ message: error.message });
  }

  if (
    error instanceof RentalPointAlreadyExistsError ||
    error instanceof CarAlreadyExistsError ||
    error instanceof ClientAlreadyExistsError ||
    error instanceof CarNotAvailableError ||
    error instanceof ClientHasOpenRentalError ||
    error instanceof RentalAlreadyFinishedError
  ) {
    return reply.status(409).send({ message: error.message });
  }

  // if (env.NODE_ENV !== "production") {
  //   console.error(error);
  // }

  return reply.status(500).send({ message: "Erro interno do servidor." });
});

app.register(routesPlugin);
