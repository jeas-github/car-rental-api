import { ICarsRepository } from "@/modules/cars/repositories/I-cars-repository";
import { IClientsRepository } from "@/modules/clients/repositories/I-clients-repository";
import { ResourceNotFoundError } from "@/modules/shared/errors/resource-not-found-error";
import { Rental } from "@prisma/client";
import { IRentalsRepository } from "../repositories/I-rentals-repository";
import { differenceInCalendarDays, endOfDay, startOfDay } from "date-fns";
import { CarNotAvailableError } from "./errors/car-not-available-error";
import { ClientHasOpenRentalError } from "./errors/client-has-open-rental-error";

interface CreateRentalUseCaseRequest {
  carId: string;
  clientId: string;
  pickupPointId: string;
  returnPointId?: string;
  pickupDate: Date;
  expectedReturnDate: Date;
}

interface CreateRentalUseCaseResponse {
  rental: Rental;
}

export class CreateRentalUseCase {
  constructor(
    private rentalsRepository: IRentalsRepository,
    private carsRepository: ICarsRepository,
    private clientsRepository: IClientsRepository,
  ) {}

  async execute({
    carId,
    clientId,
    pickupPointId,
    returnPointId,
    pickupDate,
    expectedReturnDate,
  }: CreateRentalUseCaseRequest): Promise<CreateRentalUseCaseResponse> {
    const car = await this.carsRepository.findById(carId);
    if (!car) throw new ResourceNotFoundError();

    const client = await this.clientsRepository.findById(clientId);
    if (!client) throw new ResourceNotFoundError();

    const carIsUnavailable =
      await this.rentalsRepository.findOpenRentalByCarId(carId);
    if (carIsUnavailable) throw new CarNotAvailableError();

    const clientHasOpenRental =
      await this.rentalsRepository.findOpenRentalByClientId(clientId);
    if (clientHasOpenRental) throw new ClientHasOpenRentalError();

    // Usando date-fns para um cálculo de dias de calendário mais preciso
    let rentalDays = differenceInCalendarDays(
      endOfDay(expectedReturnDate),
      startOfDay(pickupDate),
    );

    // Garante que o aluguel mínimo seja de 1 dia
    if (rentalDays <= 0) {
      rentalDays = 1;
    }

    const finalValue = rentalDays * car.dailyRate.toNumber();

    const rental = await this.rentalsRepository.create({
      car: { connect: { carId } },
      client: { connect: { clientId } },
      pickupPoint: { connect: { pointId: pickupPointId } },
      returnPoint: { connect: { pointId: returnPointId } },
      pickupDate: pickupDate,
      returnDate: expectedReturnDate,
      finalValue: finalValue,
    });

    // Atualiza o status do carro para indisponível
    await this.carsRepository.update(carId, {
      status: "alugado",
    });

    return {
      rental,
    };
  }
}
