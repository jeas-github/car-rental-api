import { InMemoryCarsRepository } from "@/modules/cars/repositories/in-memory/in-memory-cars-repository";
import { InMemoryRentalPointsRepository } from "@/modules/rental-points/repositories/in-memory/in-memory-rental-points-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryRentalsRepository } from "../repositories/in-memory/in-memory-rentals-repository";

import { ReturnCarUseCase } from "./return-car-use-case";
import { ResourceNotFoundError } from "@/modules/rental-points/use-cases/errors/resource-not-found-error";
import { RentalAlreadyFinishedError } from "./errors/rental-already-finished-error";

let rentalsRepository: InMemoryRentalsRepository;
let carsRepository: InMemoryCarsRepository;
let rentalPointsRepository: InMemoryRentalPointsRepository;
let sut: ReturnCarUseCase;

describe("Return Car Use Case", () => {
  beforeEach(async () => {
    rentalsRepository = new InMemoryRentalsRepository();
    carsRepository = new InMemoryCarsRepository();
    rentalPointsRepository = new InMemoryRentalPointsRepository();
    sut = new ReturnCarUseCase(rentalsRepository, carsRepository);

    // Setup initial data
    await carsRepository.create({
      carId: "car-01",
      licensePlate: "ABC-1234",
      brand: "Test",
      model: "Car",
      year: 2023,
      dailyRate: 100,
      status: "disponível",
      currentPoint: { connect: { pointId: "pickup-point" } },
    });

    await rentalPointsRepository.create({
      pointId: "dropoff-point",
      name: "Ponto de Devolução",
    });

    await rentalsRepository.create({
      rentalId: "rental-01",
      car: { connect: { carId: "car-01" } },
      client: { connect: { clientId: "client-01" } },
      pickupPoint: { connect: { pointId: "pickup-point" } },
      returnPoint: { connect: { pointId: "dropoff-point" } },
      pickupDate: new Date("2024-01-12T10:00:00.000Z"),
      returnDate: new Date("2024-01-15T10:00:00.000Z"),
      finalValue: 700,
      status: "ativo",
    });
  });

  it("should be able to return a car", async () => {
    const { rental } = await sut.execute({
      rentalId: "rental-01",
      dropoffPointId: "dropoff-point",
    });


    expect(rental.status).toBe("concluído");
    expect(rental.returnDate).toBeInstanceOf(Date);
    expect(rental.finalValue).not.toBeNull();

    const car = await carsRepository.findById("car-01");
    expect(car?.status).toBe("disponível");
    expect(car?.currentPointId).toBe("dropoff-point");
  });

  it("should calculate the final value correctly", async () => {
    // Mocking the return date to be 3 days after pickup
    vi.setSystemTime(new Date("2024-01-13T12:00:00.000Z"));

    const { rental } = await sut.execute({
      rentalId: "rental-01",
      dropoffPointId: "dropoff-point",
    });

    console.log(rental);

    // 3 days * R$100/day
    expect(rental.finalValue?.toNumber()).toBe(300);
  });

  it("should throw an error if rental is not found", async () => {
    await expect(
      sut.execute({
        rentalId: "non-existing-rental",
        dropoffPointId: "dropoff-point",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should throw an error if rental is already finished", async () => {
    // Finish the rental first
    await sut.execute({ rentalId: "rental-01", dropoffPointId: "dropoff-point" });

    // Try to finish it again
    await expect(
      sut.execute({ rentalId: "rental-01", dropoffPointId: "dropoff-point" }),
    ).rejects.toBeInstanceOf(RentalAlreadyFinishedError);
  });
});
