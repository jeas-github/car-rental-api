import { FastifyInstance } from "fastify";
import {
   create,
   getById,
   list,
   remove,
   update,
} from "@/modules/clients/controllers/clients-controller";
import {
   clientParamsSchema,
   clientResponseSchema,
   createClientBodySchema,
   createClientResponseSchema,
   updateClientBodySchema,
   updateClientResponseSchema,
} from "@/modules/clients/schemas/clients.schemas";
import { z } from "zod";

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
               201: createClientResponseSchema,
               409: z.object({ message: z.string() }),
            },
         },
      },
      create
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
      list
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
      getById
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
               200: updateClientResponseSchema,
               404: z.object({ message: z.string() }),
               409: z.object({ message: z.string() }),
            },
         },
      },
      update
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
      remove
   );
}
