import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { RentalPointAlreadyExistsError } from "../use-cases/errors/rental-point-already-exists-error";
import { ResourceNotFoundError } from "../use-cases/errors/resource-not-found-error";

import {
  makeCreateRentalPointUseCase,
  makeDeleteRentalPointUseCase,
  makeGetRentalPointUseCase,
  makeListRentalPointsUseCase,
  makeUpdateRentalPointUseCase,
} from "../use-cases/factories/make-rental-points-use-cases";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createRentalPointBodySchema = z.object({
    name: z.string().min(2),
    status: z.enum(["ativo", "inativo"]).optional(),
  });

  const { name, status } = createRentalPointBodySchema.parse(request.body);

  try {
    const createRentalPointUseCase = makeCreateRentalPointUseCase();

    const { rentalPoint } = await createRentalPointUseCase.execute({
      name,
      status,
    });

    return reply.status(201).send({
      message: "Ponto de aluguel criado com sucesso!",
      id: rentalPoint.pointId,
    });
  } catch (error) {
    if (error instanceof RentalPointAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }
    throw error;
  }
}

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const listRentalPointsUseCase = makeListRentalPointsUseCase();
  const { rentalPoints } = await listRentalPointsUseCase.execute();
  return reply.status(200).send(rentalPoints);
}

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const getRentalPointParamsSchema = z.object({
    id: z.string().uuid(),
  });
  const { id } = getRentalPointParamsSchema.parse(request.params);

  try {
    const getRentalPointUseCase = makeGetRentalPointUseCase();
    const { rentalPoint } = await getRentalPointUseCase.execute({ id });
    return reply.status(200).send(rentalPoint);
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }
    throw error;
  }
}

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateRentalPointParamsSchema = z.object({
    id: z.string().uuid(),
  });
  const updateRentalPointBodySchema = z.object({
    name: z.string().min(2).optional(),
    status: z.enum(["ativo", "inativo"]).optional(),
  });

  const { id } = updateRentalPointParamsSchema.parse(request.params);
  const { name, status } = updateRentalPointBodySchema.parse(request.body);
  try {
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
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }
    if (error instanceof RentalPointAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }
    throw error;
  }
}

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const deleteRentalPointParamsSchema = z.object({ id: z.string().uuid() });
  const { id } = deleteRentalPointParamsSchema.parse(request.params);

  const deleteRentalPointUseCase = makeDeleteRentalPointUseCase();
  await deleteRentalPointUseCase.execute({ id });
  return reply.status(204).send();
}
