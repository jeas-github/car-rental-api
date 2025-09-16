import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { ZodError } from "zod";

const createCarBodySchema = z.object({
  licensePlate: z.string().regex(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/i, {
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
  category: z.enum(["econômica", "sedan", "suv", "luxo", "minivan"]),
  currentPointId: z.string().uuid("O ID do ponto de locação é inválido."),
});

export async function carsRoutes(app: FastifyInstance) {
  // Rota para criar um novo carro
  app.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const {
        licensePlate,
        brand,
        model,
        year,
        dailyRate,
        category,
        currentPointId,
      } = createCarBodySchema.parse(request.body);

      // Verificação de placa duplicada
      const existingCar = await prisma.car.findUnique({
        where: { licensePlate: licensePlate.toUpperCase() },
      });

      if (existingCar) {
        return reply
          .status(409)
          .send({ message: "Um carro com esta placa já existe." });
      }

      // Verifica se o ponto de locação existe
      const rentalPointExists = await prisma.rentalPoint.findUnique({
        where: { pointId: currentPointId },
      });

      if (!rentalPointExists) {
        return reply
          .status(404)
          .send({ message: "Ponto de locação não encontrado." });
      }

      const car = await prisma.car.create({
        data: {
          licensePlate: licensePlate.toUpperCase(),
          brand,
          model,
          year,
          dailyRate,
          category,
          currentPointId,
        },
      });

      return reply.status(201).send({
        message: "Carro criado com sucesso!",
        carId: car.carId,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          message: "Dados de entrada inválidos.",
          errors: error.issues,
        });
      }
      console.error(error); // Log do erro para depuração
      return reply.status(500).send({ message: "Erro interno do servidor." });
    }
  });

  // Rota para listar todos os carros
  app.get("/", async (_, reply: FastifyReply) => {
    try {
      const cars = await prisma.car.findMany({
        orderBy: { brand: "asc" },
      });
      return reply.status(200).send(cars);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Erro interno do servidor." });
    }
  });
}
