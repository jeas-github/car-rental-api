import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { CarAlreadyExistsError } from "../use-cases/errors/car-already-exists-error";
import {
  makeCreateCarUseCase,
  makeListCarsUseCase,
  makeGetCarUseCase,
  makeUpdateCarUseCase,
  makeDeleteCarUseCase,
} from "../use-cases/factories/make-cars-use-cases";
import { ResourceNotFoundError } from "@/modules/rental-points/use-cases/errors/resource-not-found-error";

export async function create(request: FastifyRequest, reply: FastifyReply) {
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
    dailyRate: z
      .number()
      .positive("O preço da diária deve ser um número positivo."),
    currentPointId: z.string().uuid("ID do ponto de aluguel inválido."),
  });

  const { plate, brand, model, year, dailyRate, currentPointId } =
    createCarBodySchema.parse(request.body);

  try {
    const createCarUseCase = makeCreateCarUseCase();
    const { car } = await createCarUseCase.execute({
      plate,
      brand,
      model,
      year,
      dailyRate,
      currentPointId,
    });

    return reply.status(201).send({
      message: "Carro criado com sucesso!",
      data: car,
    });
  } catch (error) {
    if (error instanceof CarAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }
    // O erro do Zod já é tratado pelo error handler do Fastify
    throw error;
  }
}

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const listCarsUseCase = makeListCarsUseCase();
  const { cars } = await listCarsUseCase.execute();
  return reply.status(200).send(cars);
}

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const getCarParamsSchema = z.object({
    id: z.string().uuid("ID do carro inválido."),
  });

  const { id } = getCarParamsSchema.parse(request.params);

  const getCarUseCase = makeGetCarUseCase();
  const { car } = await getCarUseCase.execute({ carId: id });

  return reply.status(200).send(car);
}

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateCarParamsSchema = z.object({
    id: z.string().uuid("ID do carro inválido."),
  });

  const updateCarBodySchema = z.object({
    plate: z
      .string()
      .regex(/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/i, {
        message: 'A placa deve seguir o formato "ABC1D23".',
      })
      .optional(),
    brand: z
      .string()
      .min(2, "A marca deve ter pelo menos 2 caracteres.")
      .optional(),
    model: z
      .string()
      .min(2, "O modelo deve ter pelo menos 2 caracteres.")
      .optional(),
    year: z
      .number()
      .int("O ano deve ser um número inteiro.")
      .min(2015, "O ano deve ser igual ou superior a 2015.")
      .optional(),
    dailyRate: z
      .number()
      .positive("O preço da diária deve ser um número positivo.")
      .optional(),
    currentPointId: z
      .string()
      .uuid("ID do ponto de aluguel inválido.")
      .optional(),
  });

  const { id } = updateCarParamsSchema.parse(request.params);
  const { plate, brand, model, year, dailyRate, currentPointId } =
    updateCarBodySchema.parse(request.body);

  try {
    const updateCarUseCase = makeUpdateCarUseCase();
    const { car } = await updateCarUseCase.execute({
      carId: id,
      plate,
      brand,
      model,
      year,
      dailyRate,
      currentPointId,
    });

    return reply.status(200).send({
      message: "Carro atualizado com sucesso!",
      data: car,
    });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }
    if (error instanceof CarAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }
    // O erro do Zod já é tratado pelo error handler do Fastify
    throw error;
  }
}

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const deleteCarParamsSchema = z.object({
    id: z.string().uuid("ID do carro inválido."),
  });

  const { id } = deleteCarParamsSchema.parse(request.params);

  try {
    const deleteCarUseCase = makeDeleteCarUseCase();
    const { message } = await deleteCarUseCase.execute({ carId: id });

    return reply.status(200).send({ message });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }
    // Outros erros são tratados pelo error handler do Fastify
    throw error;
  }
}
