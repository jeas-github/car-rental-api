import { FastifyTypedInstance } from "@/types/types";
import {
  create,
  getById,
  list,
  remove,
  update,
} from "@/modules/cars/controllers/cars-controller";
import { z } from "zod";

const carParamsSchema = z.object({
  id: z.string().uuid("ID do carro inválido."),
});

const createCarBodySchema = z.object({
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

const updateCarBodySchema = createCarBodySchema.partial();

const carResponseSchema = z.object({
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

export async function carsRoutes(app: FastifyTypedInstance) {
  app.post(
    "/",
    {
      schema: {
        summary: "Cria um novo carro",
        tags: ["Cars"],
        body: createCarBodySchema,
        response: {
          201: z.object({
            message: z.string(),
            data: carResponseSchema,
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
        summary: "Lista todos os carros",
        tags: ["Cars"],
        response: {
          200: z.array(carResponseSchema),
        },
      },
    },
    list,
  );

  app.get(
    "/:id",
    {
      schema: {
        summary: "Busca um carro pelo ID",
        tags: ["Cars"],
        params: carParamsSchema,
        response: {
          200: carResponseSchema,
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
        summary: "Atualiza um carro pelo ID",
        tags: ["Cars"],
        params: carParamsSchema,
        body: updateCarBodySchema,
        response: {
          200: z.object({
            message: z.string(),
            data: carResponseSchema,
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
        summary: "Deleta um carro pelo ID",
        tags: ["Cars"],
        params: carParamsSchema,
        response: {
          200: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    remove,
  );
}
