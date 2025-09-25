import { FastifyTypedInstance } from "@/types/types";
import {
  create,
  returnCar,
} from "@/modules/rentals/controllers/rentals-controller";
import { z } from "zod";

const rentalParamsSchema = z.object({
  id: z.string().uuid(),
});

const createRentalBodySchema = z.object({
  carId: z.string().uuid(),
  clientId: z.string().uuid(),
  pickupPointId: z.string().uuid(),
  returnPointId: z.string().uuid().optional(),
  pickupDate: z.string().transform((str) => new Date(str)),
  expectedReturnDate: z.string().transform((str) => new Date(str)),
});

const returnCarBodySchema = z.object({
  dropoffPointId: z.string().uuid(),
});

const rentalResponseSchema = z.object({
  rentalId: z.string().uuid(),
  carId: z.string().uuid(),
  clientId: z.string().uuid(),
  pickupPointId: z.string().uuid(),
  returnPointId: z.string().uuid().nullable(),
  pickupDate: z.date(),
  returnDate: z.date().nullable(),
  expectedReturnDate: z.date(),
  finalValue: z.any().nullable(), // Prisma Decimal
  status: z.enum(["ativo", "concluído", "cancelado"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export async function rentalsRoutes(app: FastifyTypedInstance) {
  app.post(
    "/",
    {
      schema: {
        summary: "Cria um novo aluguel",
        tags: ["Rentals"],
        body: createRentalBodySchema,
        response: {
          201: z.object({ message: z.string(), rental: rentalResponseSchema }),
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
          200: z.object({ message: z.string(), rental: rentalResponseSchema }),
          404: z.object({ message: z.string() }),
          409: z.object({ message: z.string() }),
        },
      },
    },
    returnCar,
  );
}
