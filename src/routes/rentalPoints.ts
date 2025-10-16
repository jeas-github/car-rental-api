import { FastifyTypedInstance } from "@/types/types";
import { z } from "zod";

import {
  create,
  getById,
  list,
  remove,
  update,
} from "@/modules/rental-points/controllers/rental-points-controller";
import {
  createRentalPointBodySchema,
  createRentalPointResponseSchema,
  rentalPointParamsSchema,
  rentalPointResponseSchema,
  rentalPointsListSchema,
  updateRentalPointBodySchema,
  updateRentalPointResponseSchema,
} from "@/modules/rental-points/schemas/rental-points.schemas";

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
        params: rentalPointParamsSchema,
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
          201: createRentalPointResponseSchema,
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
        params: rentalPointParamsSchema,
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
        summary: "Deleta um ponto de aluguel",
        tags: ["Rental Points"],
        params: rentalPointParamsSchema,
        response: {
          204: z.null(),
          404: z.object({ message: z.string() }),
        },
      },
    },
    remove,
  );
}
