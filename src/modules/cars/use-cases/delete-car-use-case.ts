import { ICarsRepository } from "../repositories/I-cars-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface DeleteCarUseCaseRequest {
  carId: string;
}

interface DeleteCarUseCaseResponse {
  message: string;
}

export class DeleteCarUseCase {
  constructor(private carsRepository: ICarsRepository) {}

  async execute({
    carId,
  }: DeleteCarUseCaseRequest): Promise<DeleteCarUseCaseResponse> {
    const car = await this.carsRepository.findById(carId);
    if (!car) throw new ResourceNotFoundError();

    await this.carsRepository.delete(carId);
    return { message: "Carro deletado com sucesso." };
  }
}
