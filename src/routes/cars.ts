import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { ZodError } from "zod";

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
  daily_price: z
    .number()
    .positive("O preço da diária deve ser um número positivo."),
});

export async function carsRoutes(app: FastifyInstance) {
  // Rota para criar um novo carro
  app.post("/cars", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { plate, brand, model, year, daily_price } =
        createCarBodySchema.parse(request.body);

      // Verificação de placa duplicada
      const existingCar = await prisma.car.findUnique({
        where: { plate: plate.toUpperCase() },
      });

      if (existingCar) {
        return reply
          .status(409)
          .send({ message: "Um carro com esta placa já existe." });
      }

      const car = await prisma.car.create({
        data: {
          plate: plate.toUpperCase(),
          brand,
          model,
          year,
          daily_price,
        },
      });

      return reply.status(201).send({
        message: "Carro criado com sucesso!",
        data: car,
      });
    } catch (error) {
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
  app.get("/cars", async (_, reply: FastifyReply) => {
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
