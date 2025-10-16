import { InMemoryRentalPointsRepository } from "@/modules/rental-points/repositories/in-memory/in-memory-rental-points-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCarsRepository } from "../repositories/in-memory/in-memory-cars-repository";
import { CarAlreadyExistsError } from "./errors/car-already-exists-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { UpdateCarUseCase } from "./update-car-use-case";

let carsRepository: InMemoryCarsRepository;
let rentalPointsRepository: InMemoryRentalPointsRepository;
let sut: UpdateCarUseCase;

describe("Update Car Use Case", () => {
  beforeEach(async () => {
    carsRepository = new InMemoryCarsRepository();
    rentalPointsRepository = new InMemoryRentalPointsRepository();
    sut = new UpdateCarUseCase(carsRepository, rentalPointsRepository);

    await rentalPointsRepository.create({ pointId: "point-01", name: "Ponto 1" });
    await rentalPointsRepository.create({ pointId: "point-02", name: "Ponto 2" });
  });

  it("should be able to update a car", async () => {
    const createdCar = await carsRepository.create({
      licensePlate: "ABC1D23", brand: "Fiat", model: "Mobi", year: 2023, dailyRate: 100, currentPoint: { connect: { pointId: "point-01" } },
    });

    const { car } = await sut.execute({
      carId: createdCar.carId,
      brand: "Fiat Updated",
      currentPointId: "point-02",
    });

    expect(car.brand).toBe("Fiat Updated");
    expect(car.currentPointId).toBe("point-02");
  });

  it("should throw an error if car to update is not found", async () => {
    await expect(
      sut.execute({ carId: "non-existing-id", brand: "Any Brand" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to update to a license plate that already exists", async () => {
    await carsRepository.create({
      licensePlate: "EXISTING", brand: "Brand A", model: "Model A", year: 2023, dailyRate: 100, currentPoint: { connect: { pointId: "point-01" } },
    });
    const carToUpdate = await carsRepository.create({
      licensePlate: "UPDATING", brand: "Brand B", model: "Model B", year: 2023, dailyRate: 100, currentPoint: { connect: { pointId: "point-01" } },
    });

    await expect(
      sut.execute({
        carId: carToUpdate.carId,
        plate: "EXISTING",
      }),
    ).rejects.toBeInstanceOf(CarAlreadyExistsError);
  });

  it("should throw an error if new rental point does not exist", async () => {
    const createdCar = await carsRepository.create({
      licensePlate: "ABC1D23", brand: "Fiat", model: "Mobi", year: 2023, dailyRate: 100, currentPoint: { connect: { pointId: "point-01" } },
    });

    await expect(
      sut.execute({
        carId: createdCar.carId,
        currentPointId: "non-existing-point",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
