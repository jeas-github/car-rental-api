import { z } from "zod";
import { FastifyTypedInstance } from "@/types/types";

import {
  create,
  getById,
  list,
  remove,
  update,
} from "@/modules/rental-points/controllers/rental-points-controller";

const createRentalPointBodySchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  status: z.enum(["ativo", "inativo"]).optional(), // permite o campo status
});

// Zod Schema para a resposta de um único Rental Point
const rentalPointResponseSchema = z.object({
  pointId: z.string(),
  name: z.string(),
  status: z.enum(["ativo", "inativo"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Zod Schema para a resposta de uma lista de Rental Points
const rentalPointsListSchema = z.array(rentalPointResponseSchema);

const pointParamsSchema = z.object({
  id: z.string().uuid(),
});

const updateRentalPointBodySchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .optional(),
  status: z.enum(["ativo", "inativo"]).optional(),
});

const updateRentalPointResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    pointId: z.string().uuid(),
    name: z.string(),
    status: z.enum(["ativo", "inativo"]),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
});

export async function rentalPointsRoutes(app: FastifyTypedInstance) {
  // Rota para listar todos os Pontos de Locação (Rental Points)
  app.get(
    "/",
    {
      schema: {
        summary: "Lista todos os pontos de aluguel",
        tags: ["Rental Points"],
        response: {
          200: rentalPointsListSchema,
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    list,
  );

  // Rota para listar apenas um Ponto de Locação (Rental Point) pelo ID
  app.get(
    "/:id",
    {
      schema: {
        summary: "Lista um ponto de aluguel pelo ID",
        tags: ["Rental Points"],
        params: pointParamsSchema,
        response: {
          200: rentalPointResponseSchema,
          404: z.object({ message: z.string() }),
        },
      },
    },
    getById,
  );

  // Rota para criar um novo Ponto de Locação (Rental Point)
  app.post(
    "/",
    {
      schema: {
        summary: "Cria um novo ponto de aluguel",
        tags: ["Rental Points"],
        body: createRentalPointBodySchema,
        response: {
          201: z.object({
            message: z.string(),
            id: z.string(),
          }),
          400: z.object({ message: z.string() }),
          409: z.object({ message: z.string() }),
        },
      },
    },
    create,
  );

  // Rota para editar um Ponto de Locação pelo ID (PATCH)
  app.patch(
    "/:id",
    {
      schema: {
        summary: "Atualiza parcialmente um ponto de aluguel",
        tags: ["Rental Points"],
        params: pointParamsSchema,
        body: updateRentalPointBodySchema,
        response: {
          200: updateRentalPointResponseSchema,
          404: z.object({ message: z.string() }),
          409: z.object({ message: z.string() }),
        },
      },
    },
    update,
  );

  // Rota para deletar um ponto de locação
  app.delete(
    "/:id",
    {
      schema: {
        summary: "Atualiza parcialmente um ponto de aluguel",
        tags: ["Rental Points"],
        params: pointParamsSchema,
        response: {
          200: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    remove,
  );
}
