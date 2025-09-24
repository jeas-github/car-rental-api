import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCarsRepository } from "../repositories/in-memory/in-memory-cars-repository";
import { ListCarsUseCase } from "./list-cars-use-case";

let carsRepository: InMemoryCarsRepository;
let sut: ListCarsUseCase;

describe("List Cars Use Case", () => {
  beforeEach(() => {
    carsRepository = new InMemoryCarsRepository();
    sut = new ListCarsUseCase(carsRepository);
  });

  it("should be able to list all cars", async () => {
    await carsRepository.create({
      licensePlate: "DEF4E56", brand: "VW", model: "Polo", year: 2024, dailyRate: 150, currentPoint: { connect: { pointId: "point-01" } },
    });
    await carsRepository.create({
      licensePlate: "ABC1D23", brand: "Fiat", model: "Mobi", year: 2023, dailyRate: 100, currentPoint: { connect: { pointId: "point-01" } },
    });

    const { cars } = await sut.execute();

    expect(cars).toHaveLength(2);
    expect(cars[0].brand).toBe("Fiat");
    expect(cars[1].brand).toBe("VW");
  });

  it("should return an empty array when no cars exist", async () => {
    const { cars } = await sut.execute();
    expect(cars).toHaveLength(0);
  });
});
