import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryRentalPointsRepository } from "../repositories/in-memory/in-memory-rental-points-repository";
import { GetRentalPointUseCase } from "./get-rental-point-use-case";
import { ResourceNotFoundError } from "../../shared/errors/resource-not-found-error";

let rentalPointsRepository: InMemoryRentalPointsRepository;
let sut: GetRentalPointUseCase;

describe("Get Rental Point Use Case", () => {
  beforeEach(() => {
    rentalPointsRepository = new InMemoryRentalPointsRepository();
    sut = new GetRentalPointUseCase(rentalPointsRepository);
  });

  it("should be able to get a rental point by id", async () => {
    const createdPoint = await rentalPointsRepository.create({
      name: "Ponto de Teste",
    });

    const { rentalPoint } = await sut.execute({ id: createdPoint.pointId });

    expect(rentalPoint.pointId).toBe(createdPoint.pointId);
    expect(rentalPoint.name).toBe("Ponto de Teste");
  });

  it("should throw an error if rental point is not found", async () => {
    await expect(sut.execute({ id: "non-existing-id" })).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });
});