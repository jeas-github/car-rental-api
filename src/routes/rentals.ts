import { FastifyTypedInstance } from "@/types/types";
import {
  create,
  returnCar,
} from "@/modules/rentals/controllers/rentals-controller";
import { z } from "zod";
import {
  createRentalBodySchema,
  createRentalResponseSchema,
  rentalParamsSchema,
  returnCarBodySchema,
  returnCarResponseSchema,
} from "@/modules/rentals/schemas/rentals.schemas";

export async function rentalsRoutes(app: FastifyTypedInstance) {
  app.post(
    "/",
    {
      schema: {
        summary: "Cria um novo aluguel",
        tags: ["Rentals"],
        body: createRentalBodySchema,
        response: {
          201: createRentalResponseSchema,
          404: z.object({ message: z.string() }),
          409: z.object({ message: z.string() }),
        },
      },
    },
    create,
  );

  app.patch(
    "/:id/return",
    {
      schema: {
        summary: "Finaliza um aluguel (devolução do carro)",
        tags: ["Rentals"],
        params: rentalParamsSchema,
        body: returnCarBodySchema,
        response: {
          200: returnCarResponseSchema,
          404: z.object({ message: z.string() }),
          409: z.object({ message: z.string() }),
        },
      },
    },
    returnCar,
  );
}
