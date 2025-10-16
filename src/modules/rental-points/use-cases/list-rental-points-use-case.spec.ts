import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryRentalPointsRepository } from "../repositories/in-memory/in-memory-rental-points-repository";
import { ListRentalPointsUseCase } from "./list-rental-points-use-case";

let rentalPointsRepository: InMemoryRentalPointsRepository;
let sut: ListRentalPointsUseCase;

describe("List Rental Points Use Case", () => {
  beforeEach(() => {
    rentalPointsRepository = new InMemoryRentalPointsRepository();
    sut = new ListRentalPointsUseCase(rentalPointsRepository);
  });

  it("should be able to list all rental points", async () => {
    await rentalPointsRepository.create({ name: "Ponto B" });
    await rentalPointsRepository.create({ name: "Ponto A" });

    const { rentalPoints } = await sut.execute();

    expect(rentalPoints).toHaveLength(2);
    expect(rentalPoints[0].name).toBe("Ponto A"); // Verifica a ordenação
    expect(rentalPoints[1].name).toBe("Ponto B");
  });

  it("should return an empty array when no rental points exist", async () => {
    const { rentalPoints } = await sut.execute();

    expect(rentalPoints).toHaveLength(0);
  });
});