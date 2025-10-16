import { z } from "zod";

export const createRentalPointBodySchema = z.object({
  name: z.string().min(3),
  status: z.enum(["ativo", "inativo"]).optional(),
});

export const createRentalPointResponseSchema = z.object({
  message: z.string(),
  id: z.string().uuid(),
});

export const rentalPointParamsSchema = z.object({
  id: z.string().uuid(),
});

export const rentalPointResponseSchema = z.object({
  pointId: z.string().uuid(),
  name: z.string(),
  status: z.enum(["ativo", "inativo"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const rentalPointsListSchema = z.array(rentalPointResponseSchema);

export const updateRentalPointBodySchema = z.object({
  name: z.string().min(3).optional(),
  status: z.enum(["ativo", "inativo"]).optional(),
});

export const updateRentalPointResponseSchema = z.object({
  message: z.string(),
  data: rentalPointResponseSchema,
});
