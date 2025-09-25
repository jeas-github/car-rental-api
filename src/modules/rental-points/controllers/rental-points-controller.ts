import { FastifyReply, FastifyRequest } from "fastify";

import {
  makeCreateRentalPointUseCase,
  makeDeleteRentalPointUseCase,
  makeGetRentalPointUseCase,
  makeListRentalPointsUseCase,
  makeUpdateRentalPointUseCase,
} from "../use-cases/factories/make-rental-points-use-cases";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const { name, status } = request.body as {
    name: string;
    status?: "ativo" | "inativo";
  };

  const createRentalPointUseCase = makeCreateRentalPointUseCase();

  const { rentalPoint } = await createRentalPointUseCase.execute({
    name,
    status,
  });

  return reply.status(201).send({
    message: "Ponto de aluguel criado com sucesso!",
    id: rentalPoint.pointId,
  });
}

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const listRentalPointsUseCase = makeListRentalPointsUseCase();
  const { rentalPoints } = await listRentalPointsUseCase.execute();
  return reply.status(200).send(rentalPoints);
}

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };

  const getRentalPointUseCase = makeGetRentalPointUseCase();
  const { rentalPoint } = await getRentalPointUseCase.execute({ id });
  return reply.status(200).send(rentalPoint);
}

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const { name, status } = request.body as {
    name?: string;
    status?: "ativo" | "inativo";
  };

  const updateRentalPointUseCase = makeUpdateRentalPointUseCase();
  const { rentalPoint } = await updateRentalPointUseCase.execute({
    id,
    name,
    status,
  });
  return reply.status(200).send({
    message: "Ponto de aluguel atualizado com sucesso!",
    data: rentalPoint,
  });
}

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };

  const deleteRentalPointUseCase = makeDeleteRentalPointUseCase();
  await deleteRentalPointUseCase.execute({ id });
  return reply.status(204).send();
}
