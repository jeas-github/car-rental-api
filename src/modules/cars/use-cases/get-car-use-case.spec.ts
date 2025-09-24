import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCarsRepository } from "../repositories/in-memory/in-memory-cars-repository";
import { GetCarUseCase } from "./get-car-use-case";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let carsRepository: InMemoryCarsRepository;
let sut: GetCarUseCase;

describe("Get Car Use Case", () => {
  beforeEach(() => {
    carsRepository = new InMemoryCarsRepository();
    sut = new GetCarUseCase(carsRepository);
  });

  it("should be able to get a car by id", async () => {
    const createdCar = await carsRepository.create({
      licensePlate: "ABC1D23", brand: "Fiat", model: "Mobi", year: 2023, dailyRate: 100, currentPoint: { connect: { pointId: "point-01" } },
    });

    const { car } = await sut.execute({ carId: createdCar.carId });

    expect(car.carId).toBe(createdCar.carId);
    expect(car.brand).toBe("Fiat");
  });

});
