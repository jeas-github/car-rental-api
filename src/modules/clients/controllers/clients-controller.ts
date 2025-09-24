import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import {
  makeCreateClientUseCase,
  makeDeleteClientUseCase,
  makeGetClientUseCase,
  makeListClientsUseCase,
  makeUpdateClientUseCase,
} from "../use-cases/factories/make-clients-use-cases";
import { ResourceNotFoundError } from "../use-cases/erros/resource-not-found-error";
import { ClientAlreadyExistsError } from "../use-cases/erros/client-already-exists-error";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createClientBodySchema = z.object({
    name: z.string().min(2),
    cpf: z.string().length(11),
    email: z.string().email(),
    phone: z.string(),
    birthDate: z
      .string()
      .transform((str) => new Date(str))
      .refine((date) => !isNaN(date.getTime()), {
        message: "Formato de data inválido.",
      }),
    password: z.string().min(8),
    status: z.enum(["ativo", "inativo"]).optional(),
  });

  const { name, cpf, email, phone, birthDate, password, status } =
    createClientBodySchema.parse(request.body);

  try {
    const createClientUseCase = makeCreateClientUseCase();

    const { client } = await createClientUseCase.execute({
      name,
      cpf,
      email,
      phone,
      birthDate,
      password_hash: password,
      status,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...clientWithoutPassword } = client;

    return reply.status(201).send({
      message: "Cliente criado com sucesso!",
      client: clientWithoutPassword,
    });
  } catch (error) {
    if (error instanceof ClientAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }
}

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const listClientsUseCase = makeListClientsUseCase();
  const { clients } = await listClientsUseCase.execute();

  const clientsWithoutPassword = clients.map((client) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = client;
    return rest;
  });

  return reply.status(200).send(clientsWithoutPassword);
}

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const getClientParamsSchema = z.object({
    id: z.string().uuid(),
  });
  const { id } = getClientParamsSchema.parse(request.params);

  try {
    const getClientUseCase = makeGetClientUseCase();
    const { client } = await getClientUseCase.execute({ clientId: id });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...clientWithoutPassword } = client;

    return reply.status(200).send(clientWithoutPassword);
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }
    throw error;
  }
}

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateClientParamsSchema = z.object({
    id: z.string().uuid(),
  });
  const updateClientBodySchema = z
    .object({
      name: z.string().min(2),
      cpf: z.string().length(11),
      email: z.string().email(),
      phone: z.string(),
      birthDate: z.string().transform((str) => new Date(str)),
      password: z.string().min(8),
      status: z.enum(["ativo", "inativo"]),
    })
    .partial();

  const { id } = updateClientParamsSchema.parse(request.params);
  const data = updateClientBodySchema.parse(request.body);

  try {
    const updateClientUseCase = makeUpdateClientUseCase();
    const { client } = await updateClientUseCase.execute({
      clientId: id,
      ...data,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...clientWithoutPassword } = client;

    return reply.status(200).send({
      message: "Cliente atualizado com sucesso!",
      client: clientWithoutPassword,
    });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }
    if (error instanceof ClientAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }
    throw error;
  }
}

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const deleteClientParamsSchema = z.object({
    id: z.string().uuid(),
  });
  const { id } = deleteClientParamsSchema.parse(request.params);

  try {
    const deleteClientUseCase = makeDeleteClientUseCase();
    await deleteClientUseCase.execute({ clientId: id });

    return reply.status(204).send();
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }
    throw error;
  }
}
