import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { ZodError } from "zod";

const createCarBodySchema = z.object({
   licensePlate: z.string().regex(/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/i, {
      message: 'A placa deve seguir o formato "ABC1D23".',
   }),
   brand: z.string().min(2, "A marca deve ter pelo menos 2 caracteres."),
   model: z.string().min(2, "O modelo deve ter pelo menos 2 caracteres."),
   year: z
      .number()
      .int("O ano deve ser um número inteiro.")
      .min(2015, "O ano deve ser igual ou superior a 2015."),
   category: z
      .enum(["econômica", "sedan", "suv", "luxo", "minivan"])
      .optional(),
   status: z
      .enum(["disponível", "alugado", "manutenção", "desativado"])
      .optional(),
   dailyRate: z
      .number()
      .positive("O preço da diária deve ser um número positivo."),
   currentPointId: z.string().uuid("O currentPointId deve ser um UUID válido."),
});

export async function carsRoutes(app: FastifyInstance) {
   // Rota para listar todos os carros ========================================
   app.get("/", async (_, reply: FastifyReply) => {
      try {
         const cars = await prisma.car.findMany({
            orderBy: { brand: "asc" },
         });
         return reply.status(200).send(cars);
      } catch (error) {
         console.error(error);
         return reply
            .status(500)
            .send({ message: "Erro interno do servidor." });
      }
   });

   // Rota para listar apenas um Carro pelo ID ==================================
   app.get("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
      try {
         const { id } = request.params as { id: string };
         const car = await prisma.car.findUnique({
            where: { carId: id },
         });
         if (!car) {
            return reply.status(404).send({ message: "Carro não encontrado." });
         }
         return reply.status(200).send(car);
      } catch (error) {
         console.error(error);
         return reply
            .status(500)
            .send({ message: "Erro interno do servidor." });
      }
   });

   // Rota para criar um novo carro =========================================
   app.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
      try {
         // Extendendo o schema para incluir currentPointId
         const createCarBodySchema = z.object({
            licensePlate: z.string().regex(/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/i, {
               message: 'A placa deve seguir o formato "ABC1D23".',
            }),
            brand: z
               .string()
               .min(2, "A marca deve ter pelo menos 2 caracteres."),
            model: z
               .string()
               .min(2, "O modelo deve ter pelo menos 2 caracteres."),
            year: z
               .number()
               .int("O ano deve ser um número inteiro.")
               .min(2015, "O ano deve ser igual ou superior a 2015."),
            dailyRate: z
               .number()
               .positive("O preço da diária deve ser um número positivo."),
            currentPointId: z
               .string()
               .uuid("O currentPointId deve ser um UUID válido."),
         });

         const { licensePlate, brand, model, year, dailyRate, currentPointId } =
            createCarBodySchema.parse(request.body);

         // Verifica se já existe carro com a placa informada
         const existingCar = await prisma.car.findUnique({
            where: { licensePlate: licensePlate.toUpperCase() },
         });

         if (existingCar) {
            return reply
               .status(409)
               .send({ message: "Um carro com esta placa já existe." });
         }

         // Verificar se currentPointId existe na tabela rental_points
         const rentalPointExists = await prisma.rentalPoint.findUnique({
            where: { pointId: currentPointId },
         });

         if (!rentalPointExists) {
            return reply
               .status(400)
               .send({ message: "Ponto de locação informado não existe." });
         }

         // Criar o carro com o currentPointId informado
         const car = await prisma.car.create({
            data: {
               licensePlate: licensePlate.toUpperCase(),
               brand,
               model,
               year,
               dailyRate,
               currentPointId,
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
         console.error(error);
         return reply
            .status(500)
            .send({ message: "Erro interno do servidor." });
      }
   });

   // Rota para editar um Carro pelo ID (PUT) ===========================
   app.put("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
      try {
         const { id } = request.params as { id: string };

         const {
            licensePlate,
            brand,
            model,
            year,
            category,
            status,
            dailyRate,
            currentPointId,
         } = createCarBodySchema.parse(request.body);

         // Verifica se o carro existe
         const car = await prisma.car.findUnique({
            where: { carId: id },
         });

         if (!car) {
            return reply.status(404).send({ message: "Carro não encontrado." });
         }

         // Verificar se currentPointId existe na tabela rental_points
         const rentalPointExists = await prisma.rentalPoint.findUnique({
            where: { pointId: currentPointId },
         });

         if (!rentalPointExists) {
            return reply
               .status(400)
               .send({ message: "Ponto de locação informado não existe." });
         }

         // Verifica se já existe outro carro com a placa informada
         const existingCar = await prisma.car.findFirst({
            where: {
               licensePlate: licensePlate.toUpperCase(),
               NOT: { carId: id },
            },
         });

         if (existingCar) {
            return reply
               .status(409)
               .send({ message: "Um carro com esta placa já existe." });
         }

         // Atualiza o carro
         const updatedCar = await prisma.car.update({
            where: { carId: id },
            data: {
               licensePlate: licensePlate.toUpperCase(),
               brand,
               model,
               year,
               category,
               status,
               dailyRate,
               currentPointId,
            },
         });

         return reply.status(200).send({
            message: "Carro atualizado com sucesso!",
            data: updatedCar,
         });
      } catch (error) {
         if (error instanceof ZodError) {
            return reply.status(400).send({
               message: "Dados de entrada inválidos.",
               errors: error.issues,
            });
         }
         console.error(error);
         return reply
            .status(500)
            .send({ message: "Erro interno do servidor." });
      }
   });

   // Rota para editar um Carro pelo ID (PATCH) =============================
   app.patch("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
      try {
         const { id } = request.params as { id: string };
         const body = createCarBodySchema.partial().parse(request.body);

         // Verifica se o carro existe
         const carExists = await prisma.car.findUnique({
            where: { carId: id },
         });

         if (!carExists) {
            return reply.status(404).send({ message: "Carro não encontrado." });
         }

         // Se currentPointId estiver sendo atualizado, verifique se existe na tabela rental_points
         if (body.currentPointId) {
            const rentalPointExists = await prisma.rentalPoint.findUnique({
               where: { pointId: body.currentPointId },
            });

            if (!rentalPointExists) {
               return reply
                  .status(400)
                  .send({ message: "Ponto de locação informado não existe." });
            }
         }

         // Se a placa estiver sendo atualizada, verifique se já existe outro carro com a mesma placa
         if (body.licensePlate) {
            const existingCar = await prisma.car.findFirst({
               where: {
                  licensePlate: body.licensePlate.toUpperCase(),
                  NOT: { carId: id },
               },
            });

            if (existingCar) {
               return reply
                  .status(409)
                  .send({ message: "Um carro com esta placa já existe." });
            }
         }

         const updatedCar = await prisma.car.update({
            where: { carId: id },
            data: {
               ...body,
               licensePlate: body.licensePlate
                  ? body.licensePlate.toUpperCase()
                  : undefined,
            },
         });

         return reply.status(200).send({
            message: "Carro atualizado com sucesso!",
            data: updatedCar,
         });
      } catch (error) {
         if (error instanceof ZodError) {
            return reply.status(400).send({
               message: "Dados de entrada inválidos.",
               errors: error.issues,
            });
         }
         console.error(error);
         return reply
            .status(500)
            .send({ message: "Erro interno do servidor." });
      }
   });

   // Rota para deletar um arro pelo ID =========================================
   app.delete("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
      try {
         const { id } = z
            .object({ id: z.string().uuid("ID inválido.") })
            .parse(request.params);

         // Verifica se o carro existe
         const car = await prisma.car.findUnique({
            where: { carId: id },
         });

         if (!car) {
            return reply.status(404).send({ message: "Carro não encontrado." });
         }

         // Verifica se o carro está associado a algum aluguel ativo (status 'ativo')
         const activeRental = await prisma.rental.findFirst({
            where: {
               carId: id,
               status: "ativo",
            },
         });

         if (activeRental) {
            return reply.status(400).send({
               message:
                  "Não é possível deletar este carro pois ele está associado a um aluguel ativo.",
            });
         }

         // Deleta o carro
         await prisma.car.delete({ where: { carId: id } });

         return reply
            .status(200)
            .send({ message: "Carro deletado com sucesso." });
      } catch (error) {
         if (error instanceof ZodError) {
            return reply.status(400).send({
               message: "ID inválido.",
               errors: error.issues,
            });
         }
         console.error(error);
         return reply
            .status(500)
            .send({ message: "Erro interno do servidor." });
      }
   });
}
