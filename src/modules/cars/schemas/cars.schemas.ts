import { z } from "zod";

export const carParamsSchema = z.object({
  id: z.string().uuid("ID do carro inválido."),
});

export const createCarBodySchema = z.object({
  plate: z.string().regex(/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/i, {
    message: 'A placa deve seguir o formato "ABC1D23".',
  }),
  brand: z.string().min(2, "A marca deve ter pelo menos 2 caracteres."),
  model: z.string().min(2, "O modelo deve ter pelo menos 2 caracteres."),
  year: z
    .number()
    .int("O ano deve ser um número inteiro.")
    .min(2015, "O ano deve ser igual ou superior a 2015."),
  dailyRate: z
    .number()
    .positive("O preço da diária deve ser um número positivo."),
  currentPointId: z.string().uuid("ID do ponto de aluguel inválido."),
});

export const updateCarBodySchema = createCarBodySchema.partial();

export const carResponseSchema = z.object({
  carId: z.string().uuid(),
  licensePlate: z.string(),
  brand: z.string(),
  model: z.string(),
  year: z.number(),
  category: z.enum(["econômica", "sedan", "suv", "luxo", "minivan"]),
  status: z.enum(["disponível", "alugado", "manutenção", "desativado"]),
  dailyRate: z.any(), // Prisma Decimal
  currentPointId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createCarResponseSchema = z.object({
  message: z.string(),
  data: carResponseSchema,
});

export const updateCarResponseSchema = z.object({
  message: z.string(),
  data: carResponseSchema,
});

export const deleteCarResponseSchema = z.object({
  message: z.string(),
});
