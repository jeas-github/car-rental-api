import { RentalPoint } from "@prisma/client";
import { IRentalPointsRepository } from "../repositories/I-rental-points-repository";
import { RentalPointAlreadyExistsError } from "./errors/rental-point-already-exists-error";

interface CreateRentalPointUseCaseRequest {
  name: string;
  status?: "ativo" | "inativo";
}

interface CreateRentalPointUseCaseResponse {
  rentalPoint: RentalPoint;
}

export class CreateRentalPointUseCase {
  constructor(private rentalPointsRepository: IRentalPointsRepository) {}

  async execute({
    name,
    status,
  }: CreateRentalPointUseCaseRequest): Promise<CreateRentalPointUseCaseResponse> {
    const existingPoint = await this.rentalPointsRepository.findByName(name);

    if (existingPoint) {
      throw new RentalPointAlreadyExistsError();
    }

    const rentalPoint = await this.rentalPointsRepository.create({
      name,
      status,
    });

    return { rentalPoint };
  }
}
