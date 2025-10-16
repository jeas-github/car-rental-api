import { z } from "zod";

export const rentalParamsSchema = z.object({
  id: z.string().uuid(),
});

export const createRentalBodySchema = z.object({
  carId: z.string().uuid(),
  clientId: z.string().uuid(),
  pickupPointId: z.string().uuid(),
  returnPointId: z.string().uuid().optional(),
  pickupDate: z.string().transform((str) => new Date(str)),
  expectedReturnDate: z.string().transform((str) => new Date(str)),
});

export const returnCarBodySchema = z.object({
  dropoffPointId: z.string().uuid(),
});

export const rentalResponseSchema = z.object({
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

export const createRentalResponseSchema = z.object({
  message: z.string(),
  rental: rentalResponseSchema,
});

export const returnCarResponseSchema = z.object({
  message: z.string(),
  rental: rentalResponseSchema,
});
