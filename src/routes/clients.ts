import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@/lib/prisma";
import { z, ZodError } from "zod";
import bcrypt from "bcrypt";

const createClientBodySchema = z.object({
  name: z.string().min(2),
  cpf: z.string().length(11), // formato básico, inclua regex se necessário
  email: z.string().email(),
  phone: z.string(), // pode adicionar regex
  birthDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Data inválida" }),
  password: z.string().min(8),
  status: z.enum(["ativo", "inativo"]).optional(),
});

export async function clientsRoutes(app: FastifyInstance) {
  // Rota para listar todos os Clientes
  app.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const clients = await prisma.client.findMany();
      return reply.status(200).send(clients);
    } catch (error) {
      console.error("Erro ao listar clientes:", error);
      return reply.status(500).send({ error: "Erro ao listar clientes." });
    }
  });

  // Rota para listar apenas um Cliente pelo ID
  app.get("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const client = await prisma.client.findUnique({
        where: { clientId: id },
      });
      if (!client) {
        return reply.status(404).send({ error: "Cliente não encontrado." });
      }
      return reply.status(200).send(client);
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      return reply.status(500).send({ error: "Erro ao buscar cliente." });
    }
  });

  // Rota para criar um novo Cliente
  app.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = createClientBodySchema.parse(request.body);
      const birthDateObj = new Date(body.birthDate);

      // Criptografar a senha com bcrypt
      const hashedPassword = await bcrypt.hash(body.password, 10);

      const newClient = await prisma.client.create({
        data: {
          ...body,
          birthDate: birthDateObj,
          password: hashedPassword, // salvar o hash, não a senha em texto plano
        },
        select: {
          clientId: true,
          name: true,
          cpf: true,
          email: true,
          phone: true,
          birthDate: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return reply.status(201).send(newClient);
    } catch (error: any) {
      console.error("Erro detalhado:", error);

      if (error instanceof ZodError) {
        return reply.status(400).send({ errors: error.issues });
      }

      if (error.code === "P2002") {
        return reply.status(409).send({ error: "Campo único já registrado." });
      }

      return reply.status(500).send({ error: "Erro ao criar cliente." });
    }
  });

  // Rota para editar um Cliente pelo ID (PUT)
  app.put("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const body = createClientBodySchema.parse(request.body);
      const birthDateObj = new Date(body.birthDate);

      // Criptografar a senha antes de atualizar
      const hashedPassword = await bcrypt.hash(body.password, 10);

      const updatedClient = await prisma.client.update({
        where: { clientId: id },
        data: {
          ...body,
          birthDate: birthDateObj,
          password: hashedPassword, // salvar o hash da senha nova
        },
        select: {
          clientId: true,
          name: true,
          cpf: true,
          email: true,
          phone: true,
          birthDate: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return reply.status(200).send(updatedClient);
    } catch (error: any) {
      console.error("Erro detalhado:", error);
      if (error instanceof ZodError) {
        return reply.status(400).send({ errors: error.issues });
      }
      if (error.code === "P2002") {
        return reply.status(409).send({ error: "Campo único já registrado." });
      }
      if (error.code === "P2025") {
        return reply.status(404).send({ error: "Cliente não encontrado." });
      }
      return reply.status(500).send({ error: "Erro ao atualizar cliente." });
    }
  });

  // Rota para editar um Cliente pelo ID (PATCH)
  app.patch("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const body = createClientBodySchema.partial().parse(request.body);
      const birthDateObj = body.birthDate
        ? new Date(body.birthDate)
        : undefined;
      const dataToUpdate = {
        ...body,
        birthDate: birthDateObj,
      };
      // Se a senha estiver sendo atualizada, criptografe-a
      if (body.password) {
        dataToUpdate.password = await bcrypt.hash(body.password, 10);
      }
      const updatedClient = await prisma.client.update({
        where: { clientId: id },
        data: dataToUpdate,
        select: {
          clientId: true,
          name: true,
          cpf: true,
          email: true,
          phone: true,
          birthDate: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return reply.status(200).send(updatedClient);
    } catch (error: any) {
      console.error("Erro detalhado:", error);
      if (error instanceof ZodError) {
        return reply.status(400).send({ errors: error.issues });
      }
      if (error.code === "P2002") {
        return reply.status(409).send({ error: "Campo único já registrado." });
      }
      if (error.code === "P2025") {
        return reply.status(404).send({ error: "Cliente não encontrado." });
      }
      return reply.status(500).send({ error: "Erro ao atualizar cliente." });
    }
  });

  // Rota para deletar um Cliente pelo ID
  app.delete("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      await prisma.client.delete({ where: { clientId: id } });
      return reply
        .status(200)
        .send({ message: "Cliente deletado com sucesso." });
    } catch (error: any) {
      console.error("Erro ao deletar cliente:", error);
      if (error.code === "P2025") {
        // Registro não encontrado
        return reply.status(404).send({ error: "Cliente não encontrado." });
      }
      return reply.status(500).send({ error: "Erro ao deletar cliente." });
    }
  });
}
