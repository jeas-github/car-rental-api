import { RentalPoint } from "@prisma/client";
import { IRentalPointsRepository } from "../repositories/I-rental-points-repository";

interface ListRentalPointsUseCaseResponse {
  rentalPoints: RentalPoint[];
}

export class ListRentalPointsUseCase {
  constructor(private rentalPointsRepository: IRentalPointsRepository) {}

  async execute(): Promise<ListRentalPointsUseCaseResponse> {
    const rentalPoints = await this.rentalPointsRepository.findMany();

    return {
      rentalPoints,
    };
  }
}
