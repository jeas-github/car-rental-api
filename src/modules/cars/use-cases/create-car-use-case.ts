import { Car } from "@prisma/client";
import { ICarsRepository } from "../repositories/I-cars-repository";
import { CarAlreadyExistsError } from "./errors/car-already-exists-error";
import { IRentalPointsRepository } from "@/modules/rental-points/repositories/I-rental-points-repository";

interface CreateCarUseCaseRequest {
  plate: string;
  brand: string;
  model: string;
  year: number;
  dailyRate: number;
  currentPointId: string;
}

interface CreateCarUseCaseResponse {
  car: Car;
}

export class CreateCarUseCase {
  constructor(
    private carsRepository: ICarsRepository,
    private rentalPointsRepository: IRentalPointsRepository,
  ) {}

  async execute({
    plate,
    brand,
    model,
    year,
    dailyRate,
    currentPointId,
  }: CreateCarUseCaseRequest): Promise<CreateCarUseCaseResponse> {
    const upperCasePlate = plate.toUpperCase();
    const carWithSamePlate =
      await this.carsRepository.findByLicensePlate(upperCasePlate);

    if (carWithSamePlate) {
      throw new CarAlreadyExistsError();
    }

    const rentalPoint =
      await this.rentalPointsRepository.findById(currentPointId);

    if (!rentalPoint) {
      throw new Error("Ponto de aluguel não encontrado.");
    }

    const car = await this.carsRepository.create({
      licensePlate: upperCasePlate,
      brand,
      model,
      year,
      dailyRate,
      currentPoint: { connect: { pointId: rentalPoint.pointId } },
    });
    return { car };
  }
}
