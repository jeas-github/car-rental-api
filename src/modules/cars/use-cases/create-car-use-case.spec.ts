import { InMemoryRentalPointsRepository } from "@/modules/rental-points/repositories/in-memory/in-memory-rental-points-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCarsRepository } from "../repositories/in-memory/in-memory-cars-repository";
import { CreateCarUseCase } from "./create-car-use-case";
import { CarAlreadyExistsError } from "./errors/car-already-exists-error";

let carsRepository: InMemoryCarsRepository;
let rentalPointsRepository: InMemoryRentalPointsRepository;
let sut: CreateCarUseCase;

describe("Create Car Use Case", () => {
  beforeEach(async () => {
    carsRepository = new InMemoryCarsRepository();
    rentalPointsRepository = new InMemoryRentalPointsRepository();
    sut = new CreateCarUseCase(carsRepository, rentalPointsRepository);

    await rentalPointsRepository.create({
      pointId: "point-01",
      name: "Ponto de Teste",
    });
  });

  it("should be able to create a new car", async () => {
    const { car } = await sut.execute({
      plate: "ABC1D23",
      brand: "Fiat",
      model: "Mobi",
      year: 2023,
      dailyRate: 100,
      currentPointId: "point-01",
    });

    expect(car.carId).toEqual(expect.any(String));
    expect(car.licensePlate).toBe("ABC1D23");
  });

  it("should not be able to create a car with a duplicate license plate", async () => {
    await sut.execute({
      plate: "ABC1D23",
      brand: "Fiat",
      model: "Mobi",
      year: 2023,
      dailyRate: 100,
      currentPointId: "point-01",
    });

    await expect(() =>
      sut.execute({
        plate: "ABC1D23",
        brand: "VW",
        model: "Polo",
        year: 2024,
        dailyRate: 150,
        currentPointId: "point-01",
      }),
    ).rejects.toBeInstanceOf(CarAlreadyExistsError);
  });

  it("should throw an error if the rental point does not exist", async () => {
    await expect(
      sut.execute({
        plate: "XYZ9G87", brand: "Ford", model: "Ka", year: 2020, dailyRate: 90, currentPointId: "non-existing-point",
      }),
    ).rejects.toThrow("Ponto de aluguel não encontrado.");
  });
});
