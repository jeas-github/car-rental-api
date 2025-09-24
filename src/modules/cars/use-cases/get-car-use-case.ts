import { Car } from "@prisma/client";
import { ICarsRepository } from "../repositories/I-cars-repository";
import { ResourceNotFoundError } from "@/modules/rental-points/use-cases/errors/resource-not-found-error";

interface GetCarUseCaseRequest {
  carId: string;
}

interface GetCarUseCaseResponse {
  car: Car;
}

export class GetCarUseCase {
  constructor(private carsRepository: ICarsRepository) {}

  async execute({
    carId,
  }: GetCarUseCaseRequest): Promise<GetCarUseCaseResponse> {
    const car = await this.carsRepository.findById(carId);
    if (!car) {
      throw new ResourceNotFoundError();
    }

    return { car };
  }
}
