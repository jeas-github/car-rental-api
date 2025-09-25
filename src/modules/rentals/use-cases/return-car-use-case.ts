import { ICarsRepository } from "@/modules/cars/repositories/I-cars-repository";
import { ResourceNotFoundError } from "@/modules/shared/errors/resource-not-found-error";
import { Rental } from "@prisma/client";
import { differenceInCalendarDays } from "date-fns";
import { IRentalsRepository } from "../repositories/I-rentals-repository";
import { RentalAlreadyFinishedError } from "./errors/rental-already-finished-error";

interface ReturnCarUseCaseRequest {
  rentalId: string;
  dropoffPointId: string;
}

interface ReturnCarUseCaseResponse {
  rental: Rental;
}

export class ReturnCarUseCase {
  constructor(
    private rentalsRepository: IRentalsRepository,
    private carsRepository: ICarsRepository,
  ) {}

  async execute({
    rentalId,
    dropoffPointId,
  }: ReturnCarUseCaseRequest): Promise<ReturnCarUseCaseResponse> {
    const rental = await this.rentalsRepository.findById(rentalId);
    if (!rental) throw new ResourceNotFoundError();

    if (rental.status === "concluído") {
      throw new RentalAlreadyFinishedError();
    }

    const car = await this.carsRepository.findById(rental.carId);
    if (!car) throw new ResourceNotFoundError(); // Should not happen

    const returnDate = new Date();
    const pickupDate = rental.pickupDate;

    let rentalDays = differenceInCalendarDays(returnDate, pickupDate);
    if (rentalDays <= 0) {
      rentalDays = 1;
    }

    const finalValue = rentalDays * car.dailyRate.toNumber();

    const updatedRental = await this.rentalsRepository.update(rentalId, {
      returnDate,
      finalValue,
      status: "concluído",
      returnPoint: {
        connect: { pointId: dropoffPointId },
      },
    });

    await this.carsRepository.update(rental.carId, {
      status: "disponível",
      currentPoint: {
        connect: { pointId: dropoffPointId },
      },
    });

    return { rental: updatedRental };
  }
}
