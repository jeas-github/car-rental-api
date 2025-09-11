import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { FastifyTypedInstance } from "@/types/types";
import { Prisma } from "@prisma/client";

const createRentalPointBodySchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  status: z.enum(["ativo", "inativo"]).optional(), // permite o campo status
});

// Zod Schema para a resposta de um único Rental Point
const rentalPointResponseSchema = z.object({
  pointId: z.string(),
  name: z.string(),
  status: z.enum(["ativo", "inativo"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Zod Schema para a resposta de uma lista de Rental Points
const rentalPointsListSchema = z.array(rentalPointResponseSchema);

const pointParamsSchema = z.object({
  id: z.string().uuid(),
});

const updateRentalPointBodySchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .optional(),
  status: z.enum(["ativo", "inativo"]).optional(),
});

const updateRentalPointResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    pointId: z.string().uuid(),
    name: z.string(),
    status: z.enum(["ativo", "inativo"]),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
});

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
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (_, reply) => {
      const rentalPoints = await prisma.rentalPoint.findMany({
        orderBy: { name: "asc" },
      });
      return reply.status(200).send(rentalPoints);
    },
  );

  // Rota para listar apenas um Ponto de Locação (Rental Point) pelo ID
  app.get(
    "/:id",
    {
      schema: {
        summary: "Lista um ponto de aluguel pelo ID",
        tags: ["Rental Points"],
        params: pointParamsSchema,
        response: {
          200: rentalPointResponseSchema,
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const rentalPoint = await prisma.rentalPoint.findUnique({
        where: { pointId: request.params.id },
      });

      if (!rentalPoint) {
        return reply
          .status(404)
          .send({ message: "Ponto de aluguel não encontrado." });
      }
      return reply.status(200).send(rentalPoint);
    },
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
          201: z.object({
            message: z.string(),
            pointId: z.string().uuid(),
          }),
          409: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { name, status } = request.body;

      const existingPoint = await prisma.rentalPoint.findUnique({
        where: { name },
      });

      if (existingPoint) {
        return reply.status(409).send({
          message: "Um ponto de aluguel com este nome já existe.",
        });
      }

      const rentalPoint = await prisma.rentalPoint.create({
        data: { name, status },
      });

      return reply.status(201).send({
        message: "Ponto de aluguel criado com sucesso!",
        pointId: rentalPoint.pointId,
      });
    },
  );

  // Rota para editar um Ponto de Locação pelo ID (PATCH)
  app.patch(
    "/:id",
    {
      schema: {
        summary: "Atualiza parcialmente um ponto de aluguel",
        tags: ["Rental Points"],
        params: pointParamsSchema,
        body: updateRentalPointBodySchema,
        response: {
          200: updateRentalPointResponseSchema,
          404: z.object({ message: z.string() }),
          409: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { name, status } = request.body;

      const rentalPoint = await prisma.rentalPoint.findUnique({
        where: { pointId: id },
      });

      if (!rentalPoint) {
        return reply
          .status(404)
          .send({ message: "Ponto de aluguel não encontrado." });
      }
      // Verificação de nome duplicado
      if (name) {
        const existingPoint = await prisma.rentalPoint.findUnique({
          where: { name: name },
        });

        if (existingPoint && existingPoint.pointId !== id) {
          return reply.status(409).send({
            message: "Um ponto de aluguel com este nome já existe.",
          });
        }
      }

      const updatedPoint = await prisma.rentalPoint.update({
        where: { pointId: id },
        data: { name, status },
      });
      return reply.status(200).send({
        message: "Ponto de aluguel atualizado com sucesso!",
        data: updatedPoint,
      });
    },
  );

  // Rota para deletar um ponto de locação
  app.delete(
    "/:id",
    {
      schema: {
        summary: "Deleta um ponto de aluguel",
        tags: ["Rental Points"],
        params: pointParamsSchema,
        response: {
          204: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      try {
        await prisma.rentalPoint.delete({
          where: { pointId: id },
        });

        return reply.status(204).send();
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          return reply.status(404).send({
            message: "Ponto de aluguel não encontrado.",
          });
        }
        throw error; // Re-lança outros erros para o manipulador padrão do Fastify
      }
    },
  );
}
