import { RentalPoint } from "@prisma/client";
import { IRentalPointsRepository } from "../repositories/I-rental-points-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetRentalPointUseCaseRequest {
  id: string;
}

interface GetRentalPointUseCaseResponse {
  rentalPoint: RentalPoint;
}

export class GetRentalPointUseCase {
  constructor(private rentalPointsRepository: IRentalPointsRepository) {}

  async execute({
    id,
  }: GetRentalPointUseCaseRequest): Promise<GetRentalPointUseCaseResponse> {
    const rentalPoint = await this.rentalPointsRepository.findById(id);
    if (!rentalPoint) throw new ResourceNotFoundError();
    return { rentalPoint };
  }
}
