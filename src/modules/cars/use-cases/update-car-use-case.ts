import { IRentalPointsRepository } from "@/modules/rental-points/repositories/I-rental-points-repository";
import { Car } from "@prisma/client";
import { ICarsRepository } from "../repositories/I-cars-repository";
import { CarAlreadyExistsError } from "./errors/car-already-exists-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface UpdateCarUseCaseRequest {
  carId: string;
  plate?: string;
  brand?: string;
  model?: string;
  year?: number;
  dailyRate?: number;
  currentPointId?: string;
}

interface UpdateCarUseCaseResponse {
  car: Car;
}

export class UpdateCarUseCase {
  constructor(
    private carsRepository: ICarsRepository,
    private rentalPointsRepository: IRentalPointsRepository,
  ) {}

  async execute({
    carId,
    plate,
    brand,
    model,
    year,
    dailyRate,
    currentPointId,
  }: UpdateCarUseCaseRequest): Promise<UpdateCarUseCaseResponse> {
    const carToUpdate = await this.carsRepository.findById(carId);
    if (!carToUpdate) throw new ResourceNotFoundError();

    if (plate) {
      const upperCasePlate = plate.toUpperCase();
      const carWithSamePlate =
        await this.carsRepository.findByLicensePlate(upperCasePlate);
      if (carWithSamePlate && carWithSamePlate.carId !== carId) {
        throw new CarAlreadyExistsError();
      }
    }

    if (currentPointId) {
      const rentalPoint =
        await this.rentalPointsRepository.findById(currentPointId);
      if (!rentalPoint) {
        throw new ResourceNotFoundError(); // Ou um erro mais específico
      }
    }

    const car = await this.carsRepository.update(carId, {
      licensePlate: plate?.toUpperCase(),
      brand,
      model,
      year,
      dailyRate,
      currentPoint: { connect: { pointId: currentPointId } },
    });

    return { car };
  }
}
