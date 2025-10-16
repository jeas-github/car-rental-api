import { PrismaRentalPointsRepository } from "../../repositories/prisma/prisma-rental-points-repository";
import { CreateRentalPointUseCase } from "../create-rental-point-use-case";
import { ListRentalPointsUseCase } from "../list-rental-points-use-case";
import { GetRentalPointUseCase } from "../get-rental-point-use-case";
import { UpdateRentalPointUseCase } from "../update-rental-point-use-case";
import { DeleteRentalPointUseCase } from "../delete-rental-point-use-case";

export function makeCreateRentalPointUseCase() {
  const rentalPointsRepository = new PrismaRentalPointsRepository();
  const useCase = new CreateRentalPointUseCase(rentalPointsRepository);
  return useCase;
}

export function makeListRentalPointsUseCase() {
  const rentalPointsRepository = new PrismaRentalPointsRepository();
  const useCase = new ListRentalPointsUseCase(rentalPointsRepository);
  return useCase;
}

export function makeGetRentalPointUseCase() {
  const rentalPointsRepository = new PrismaRentalPointsRepository();
  const useCase = new GetRentalPointUseCase(rentalPointsRepository);
  return useCase;
}

export function makeUpdateRentalPointUseCase() {
  const rentalPointsRepository = new PrismaRentalPointsRepository();
  const useCase = new UpdateRentalPointUseCase(rentalPointsRepository);
  return useCase;
}

export function makeDeleteRentalPointUseCase() {
  const rentalPointsRepository = new PrismaRentalPointsRepository();
  const useCase = new DeleteRentalPointUseCase(rentalPointsRepository);
  return useCase;
}
