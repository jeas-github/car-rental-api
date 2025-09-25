import { FastifyInstance } from "fastify";
import {
  create,
  getById,
  list,
  remove,
  update,
} from "@/modules/clients/controllers/clients-controller";
import { z } from "zod";

const clientParamsSchema = z.object({
  id: z.string().uuid(),
});

const createClientBodySchema = z.object({
  name: z.string().min(2),
  cpf: z.string().length(11),
  email: z.string().email(),
  phone: z.string(),
  birthDate: z.string().transform((str) => new Date(str)),
  password: z.string().min(8),
  status: z.enum(["ativo", "inativo"]).optional(),
});

const updateClientBodySchema = createClientBodySchema.partial();

const clientResponseSchema = z.object({
  clientId: z.string().uuid(),
  name: z.string(),
  cpf: z.string(),
  email: z.string().email(),
  phone: z.string(),
  birthDate: z.date(),
  status: z.enum(["ativo", "inativo"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export async function clientsRoutes(app: FastifyInstance) {
  // Rota para criar um novo Cliente
  app.post(
    "/",
    {
      schema: {
        summary: "Cria um novo cliente",
        tags: ["Clients"],
        body: createClientBodySchema,
        response: {
          201: z.object({
            message: z.string(),
            client: clientResponseSchema,
          }),
          409: z.object({ message: z.string() }),
        },
      },
    },
    create,
  );

  app.get(
    "/",
    {
      schema: {
        summary: "Lista todos os clientes",
        tags: ["Clients"],
        response: {
          200: z.array(clientResponseSchema),
        },
      },
    },
    list,
  );

  app.get(
    "/:id",
    {
      schema: {
        summary: "Busca um cliente pelo ID",
        tags: ["Clients"],
        params: clientParamsSchema,
        response: {
          200: clientResponseSchema,
          404: z.object({ message: z.string() }),
        },
      },
    },
    getById,
  );

  app.patch(
    "/:id",
    {
      schema: {
        summary: "Atualiza um cliente pelo ID",
        tags: ["Clients"],
        params: clientParamsSchema,
        body: updateClientBodySchema,
        response: {
          200: z.object({
            message: z.string(),
            client: clientResponseSchema,
          }),
          404: z.object({ message: z.string() }),
          409: z.object({ message: z.string() }),
        },
      },
    },
    update,
  );

  app.delete(
    "/:id",
    {
      schema: {
        summary: "Deleta um cliente pelo ID",
        tags: ["Clients"],
        params: clientParamsSchema,
        response: {
          204: z.null(),
          404: z.object({ message: z.string() }),
        },
      },
    },
    remove,
  );
}
