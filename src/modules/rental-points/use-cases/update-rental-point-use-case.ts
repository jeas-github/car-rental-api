import { RentalPoint } from "@prisma/client";
import { IRentalPointsRepository } from "../repositories/I-rental-points-repository";
import { RentalPointAlreadyExistsError } from "./errors/rental-point-already-exists-error";
import { ResourceNotFoundError } from "../../shared/errors/resource-not-found-error";

interface UpdateRentalPointUseCaseRequest {
  id: string;
  name?: string;
  status?: "ativo" | "inativo";
}

interface UpdateRentalPointUseCaseResponse {
  rentalPoint: RentalPoint;
}

export class UpdateRentalPointUseCase {
  constructor(private rentalPointsRepository: IRentalPointsRepository) {}

  async execute({
    id,
    name,
    status,
  }: UpdateRentalPointUseCaseRequest): Promise<UpdateRentalPointUseCaseResponse> {
    const rentalPointToUpdate = await this.rentalPointsRepository.findById(id);
    if (!rentalPointToUpdate) throw new ResourceNotFoundError();

    if (name) {
      const existingPoint = await this.rentalPointsRepository.findByName(name);
      if (existingPoint && existingPoint.pointId !== id) {
        throw new RentalPointAlreadyExistsError();
      }
    }

    const rentalPoint = await this.rentalPointsRepository.update(id, {
      name,
      status,
    });
    return { rentalPoint };
  }
}
