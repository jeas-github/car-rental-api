import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@/lib/prisma";
import { z, ZodError } from "zod";

const createRentalPointBodySchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  status: z.enum(["ativo", "inativo"]).optional(), // permite o campo status
});

export async function rentalPointsRoutes(app: FastifyInstance) {
  // Rota para listar todos os Pontos de Locação (Rental Points)
  app.get("/", async (_, reply: FastifyReply) => {
    try {
      const rentalPoints = await prisma.rentalPoint.findMany({
        orderBy: { name: "asc" },
      });
      return reply.status(200).send(rentalPoints);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Erro interno do servidor." });
    }
  });

  // Rota para listar apenas um Ponto de Locação (Rental Point) pelo ID
  app.get("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const rentalPoint = await prisma.rentalPoint.findUnique({
        where: { pointId: id },
      });
      if (!rentalPoint) {
        return reply
          .status(404)
          .send({ message: "Ponto de aluguel não encontrado." });
      }
      return reply.status(200).send(rentalPoint);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Erro interno do servidor." });
    }
  });

  // Rota para criar um novo Ponto de Locação (Rental Point)
  app.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { name, status } = createRentalPointBodySchema.parse(request.body);

      // Verificação de nome duplicado
      const existingPoint = await prisma.rentalPoint.findUnique({
        where: { name: name },
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
        data: {
          uuid: rentalPoint.pointId,
          name: rentalPoint.name,
        },
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

  // Rota para editar um Ponto de Locação pelo ID (PUT)
  app.put("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const { name, status } = createRentalPointBodySchema.parse(request.body);
      const rentalPoint = await prisma.rentalPoint.findUnique({
        where: { pointId: id },
      });
      if (!rentalPoint) {
        return reply
          .status(404)
          .send({ message: "Ponto de aluguel não encontrado." });
      }
      // Verificação de nome duplicado
      const existingPoint = await prisma.rentalPoint.findUnique({
        where: { name: name },
      });
      if (existingPoint && existingPoint.pointId !== id) {
        return reply.status(409).send({
          message: "Um ponto de aluguel com este nome já existe.",
        });
      }
      const updatedPoint = await prisma.rentalPoint.update({
        where: { pointId: id },
        data: { name, status },
      });
      return reply.status(200).send({
        message: "Ponto de aluguel atualizado com sucesso!",
        data: updatedPoint,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          message: "Dados de entrada inválidos.",
          errors: error.issues,
        });
      }
      console.error(error);
      return reply.status(500).send({ message: "Erro interno do servidor." });
    }
  });

  // Rota para editar um Ponto de Locação pelo ID (PATCH)
  app.patch("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const { name, status } = createRentalPointBodySchema
        .partial()
        .parse(request.body);
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
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          message: "Dados de entrada inválidos.",
          errors: error.issues,
        });
      }
      console.error(error);
      return reply.status(500).send({ message: "Erro interno do servidor." });
    }
  });

  // Rota para deletar um ponto de locação
  app.delete("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const rentalPoint = await prisma.rentalPoint.findUnique({
        where: { pointId: id },
      });

      if (!rentalPoint) {
        return reply
          .status(404)
          .send({ message: "Ponto de aluguel não encontrado." });
      }

      await prisma.rentalPoint.delete({
        where: { pointId: id },
      });

      return reply.status(200).send({
        message: "Ponto de aluguel deletado com sucesso!",
      });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Erro interno do servidor." });
    }
  });
}
