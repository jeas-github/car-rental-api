import { Car } from "@prisma/client";
import { ICarsRepository } from "../repositories/I-cars-repository";

interface ListCarsUseCaseResponse {
  cars: Car[];
}

export class ListCarsUseCase {
  constructor(private carsRepository: ICarsRepository) {}

  async execute(): Promise<ListCarsUseCaseResponse> {
    const cars = await this.carsRepository.findMany();
    return { cars };
  }
}
