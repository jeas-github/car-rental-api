import { PrismaCarsRepository } from "../../repositories/prisma/prisma-cars-repository";
import { PrismaRentalPointsRepository } from "@/modules/rental-points/repositories/prisma/prisma-rental-points-repository";
import { CreateCarUseCase } from "../create-car-use-case";
import { ListCarsUseCase } from "../list-cars-use-case";
import { GetCarUseCase } from "../get-car-use-case";
import { UpdateCarUseCase } from "../update-car-use-case";
import { DeleteCarUseCase } from "../delete-car-use-case";

export function makeCreateCarUseCase() {
  const carsRepository = new PrismaCarsRepository();
  const rentalPointsRepository = new PrismaRentalPointsRepository();
  const createCarUseCase = new CreateCarUseCase(
    carsRepository,
    rentalPointsRepository,
  );
  return createCarUseCase;
}

export function makeListCarsUseCase() {
  const carsRepository = new PrismaCarsRepository();
  const listCarsUseCase = new ListCarsUseCase(carsRepository);
  return listCarsUseCase;
}

export function makeGetCarUseCase() {
  const carsRepository = new PrismaCarsRepository();
  const getCarUseCase = new GetCarUseCase(carsRepository);
  return getCarUseCase;
}

export function makeUpdateCarUseCase() {
  const carsRepository = new PrismaCarsRepository();
  const rentalPointsRepository = new PrismaRentalPointsRepository();
  const updateCarUseCase = new UpdateCarUseCase(
    carsRepository,
    rentalPointsRepository,
  );
  return updateCarUseCase;
}

export function makeDeleteCarUseCase() {
  const carsRepository = new PrismaCarsRepository();
  const deleteCarUseCase = new DeleteCarUseCase(carsRepository);
  return deleteCarUseCase;
}
