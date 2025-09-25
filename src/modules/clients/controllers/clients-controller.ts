import { FastifyReply, FastifyRequest } from "fastify";
import {
  makeCreateClientUseCase,
  makeDeleteClientUseCase,
  makeGetClientUseCase,
  makeListClientsUseCase,
  makeUpdateClientUseCase,
} from "../use-cases/factories/make-clients-use-cases";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const { name, cpf, email, phone, birthDate, password, status } =
    request.body as {
      name: string;
      cpf: string;
      email: string;
      phone: string;
      birthDate: Date;
      password_hash: string;
      status?: "ativo" | "inativo";
      password?: string;
    };

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
  const { id } = request.params as { id: string };

  const getClientUseCase = makeGetClientUseCase();
  const { client } = await getClientUseCase.execute({ clientId: id });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...clientWithoutPassword } = client;

  return reply.status(200).send(clientWithoutPassword);
}

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const data = request.body as {
    name?: string;
    cpf?: string;
    email?: string;
    phone?: string;
    birthDate?: Date;
    password?: string;
    status?: "ativo" | "inativo";
  };

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
}

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };

  const deleteClientUseCase = makeDeleteClientUseCase();
  await deleteClientUseCase.execute({ clientId: id });

  return reply.status(204).send();
}
