import { FastifyReply, FastifyRequest } from "fastify";
import {
  makeCreateRentalUseCase,
  makeReturnCarUseCase,
} from "../use-cases/factories/make-rentals-use-cases";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as {
    carId: string;
    clientId: string;
    pickupPointId: string;
    returnPointId?: string;
    pickupDate: Date;
    expectedReturnDate: Date;
  };

  const createRentalUseCase = makeCreateRentalUseCase();

  const { rental } = await createRentalUseCase.execute(body);

  return reply.status(201).send({
    message: "Aluguel criado com sucesso!",
    rental,
  });
}

export async function returnCar(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const { dropoffPointId } = request.body as { dropoffPointId: string };

  const returnCarUseCase = makeReturnCarUseCase();

  const { rental } = await returnCarUseCase.execute({
    rentalId: id,
    dropoffPointId,
  });

  return reply.status(200).send({
    message: "Carro devolvido com sucesso!",
    rental,
  });
}
