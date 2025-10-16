import { IRentalPointsRepository } from "../repositories/I-rental-points-repository";
import { ResourceNotFoundError } from "../../shared/errors/resource-not-found-error";

interface DeleteRentalPointUseCaseRequest {
  id: string;
}

export class DeleteRentalPointUseCase {
  constructor(private rentalPointsRepository: IRentalPointsRepository) {}

  async execute({ id }: DeleteRentalPointUseCaseRequest): Promise<void> {
    const rentalPoint = await this.rentalPointsRepository.findById(id);

    if (!rentalPoint) {
      throw new ResourceNotFoundError();
    }

    await this.rentalPointsRepository.delete(id);
  }
}
