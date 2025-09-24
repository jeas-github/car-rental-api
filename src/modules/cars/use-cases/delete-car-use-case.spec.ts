import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCarsRepository } from "../repositories/in-memory/in-memory-cars-repository";
import { DeleteCarUseCase } from "./delete-car-use-case";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let carsRepository: InMemoryCarsRepository;
let sut: DeleteCarUseCase;

describe("Delete Car Use Case", () => {
  beforeEach(() => {
    carsRepository = new InMemoryCarsRepository();
    sut = new DeleteCarUseCase(carsRepository);
  });

  it("should be able to delete a car", async () => {
    const createdCar = await carsRepository.create({
      licensePlate: "ABC1D23", brand: "Fiat", model: "Mobi", year: 2023, dailyRate: 100, currentPoint: { connect: { pointId: "point-01" } },
    });

    await sut.execute({ carId: createdCar.carId });

    expect(carsRepository.items).toHaveLength(0);
  });

  it("should throw an error if car to delete is not found", async () => {
    await expect(sut.execute({ carId: "non-existing-id" })).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });
});
