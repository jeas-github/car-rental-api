import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import {
  makeCreateRentalUseCase,
  makeReturnCarUseCase,
} from "../use-cases/factories/make-rentals-use-cases";
import { ResourceNotFoundError } from "@/modules/rental-points/use-cases/errors/resource-not-found-error";
import { CarNotAvailableError } from "../use-cases/errors/car-not-available-error";
import { ClientHasOpenRentalError } from "../use-cases/errors/client-has-open-rental-error";
import { RentalAlreadyFinishedError } from "../use-cases/errors/rental-already-finished-error";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createRentalBodySchema = z.object({
    carId: z.string().uuid(),
    clientId: z.string().uuid(),
    pickupPointId: z.string().uuid(),
    returnPointId: z.string().uuid().optional(),
    pickupDate: z.string().transform((str) => new Date(str)),
    expectedReturnDate: z.string().transform((str) => new Date(str)),
  });

  const {
    carId,
    clientId,
    pickupPointId,
    returnPointId,
    pickupDate,
    expectedReturnDate,
  } = createRentalBodySchema.parse(request.body);

  try {
    const createRentalUseCase = makeCreateRentalUseCase();

    const { rental } = await createRentalUseCase.execute({
      carId,
      clientId,
      pickupPointId,
      returnPointId,
      pickupDate,
      expectedReturnDate,
    });

    return reply.status(201).send({
      message: "Aluguel criado com sucesso!",
      rental,
    });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: "Recurso não encontrado (carro, cliente ou ponto de aluguel).",
      });
    }
    if (error instanceof CarNotAvailableError) {
      return reply.status(409).send({ message: error.message });
    }
    if (error instanceof ClientHasOpenRentalError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }
}

export async function returnCar(request: FastifyRequest, reply: FastifyReply) {
  const returnCarParamsSchema = z.object({
    id: z.string().uuid(),
  });
  const returnCarBodySchema = z.object({
    dropoffPointId: z.string().uuid(),
  });

  const { id } = returnCarParamsSchema.parse(request.params);
  const { dropoffPointId } = returnCarBodySchema.parse(request.body);

  try {
    const returnCarUseCase = makeReturnCarUseCase();

    const { rental } = await returnCarUseCase.execute({
      rentalId: id,
      dropoffPointId,
    });

    return reply.status(200).send({
      message: "Carro devolvido com sucesso!",
      rental,
    });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: "Aluguel não encontrado." });
    }
    if (error instanceof RentalAlreadyFinishedError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }
}
