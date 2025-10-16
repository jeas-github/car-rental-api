import { PrismaCarsRepository } from "@/modules/cars/repositories/prisma/prisma-cars-repository";
import { PrismaClientsRepository } from "@/modules/clients/repositories/prisma/prisma-clients-repository";
import { PrismaRentalsRepository } from "../../repositories/prisma/prisma-rentals-repository";
import { CreateRentalUseCase } from "../create-rental-use-case";
import { ReturnCarUseCase } from "../return-car-use-case";

export function makeCreateRentalUseCase() {
  const rentalsRepository = new PrismaRentalsRepository();
  const carsRepository = new PrismaCarsRepository();
  const clientsRepository = new PrismaClientsRepository();

  const useCase = new CreateRentalUseCase(
    rentalsRepository,
    carsRepository,
    clientsRepository,
  );

  return useCase;
}

export function makeReturnCarUseCase() {
  const rentalsRepository = new PrismaRentalsRepository();
  const carsRepository = new PrismaCarsRepository();

  const useCase = new ReturnCarUseCase(rentalsRepository, carsRepository);
  return useCase;
}
