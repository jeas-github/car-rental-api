import { FastifyReply, FastifyRequest } from "fastify";
import {
  makeCreateCarUseCase,
  makeListCarsUseCase,
  makeGetCarUseCase,
  makeUpdateCarUseCase,
  makeDeleteCarUseCase,
} from "../use-cases/factories/make-cars-use-cases";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const { plate, brand, model, year, dailyRate, currentPointId } =
    request.body as {
      plate: string;
      brand: string;
      model: string;
      year: number;
      dailyRate: number;
      currentPointId: string;
    };

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
}

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const listCarsUseCase = makeListCarsUseCase();
  const { cars } = await listCarsUseCase.execute();
  return reply.status(200).send(cars);
}

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };

  const getCarUseCase = makeGetCarUseCase();
  const { car } = await getCarUseCase.execute({ carId: id });

  return reply.status(200).send(car);
}

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const { plate, brand, model, year, dailyRate, currentPointId } =
    request.body as {
      plate?: string;
      brand?: string;
      model?: string;
      year?: number;
      dailyRate?: number;
      currentPointId?: string;
    };

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
}

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };

  const deleteCarUseCase = makeDeleteCarUseCase();
  const { message } = await deleteCarUseCase.execute({ carId: id });

  return reply.status(200).send({ message });
}
