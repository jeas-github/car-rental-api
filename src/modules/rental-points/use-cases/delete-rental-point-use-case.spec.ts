import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryRentalPointsRepository } from "../repositories/in-memory/in-memory-rental-points-repository";
import { DeleteRentalPointUseCase } from "./delete-rental-point-use-case";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let rentalPointsRepository: InMemoryRentalPointsRepository;
let sut: DeleteRentalPointUseCase;

describe("Delete Rental Point Use Case", () => {
  beforeEach(() => {
    rentalPointsRepository = new InMemoryRentalPointsRepository();
    sut = new DeleteRentalPointUseCase(rentalPointsRepository);
  });

  it("should be able to delete a rental point", async () => {
    const createdPoint = await rentalPointsRepository.create({
      name: "Ponto a ser deletado",
    });

    await sut.execute({ id: createdPoint.pointId });

    expect(rentalPointsRepository.items).toHaveLength(0);
  });

  it("should throw an error if rental point to delete is not found", async () => {
    await expect(sut.execute({ id: "non-existing-id" })).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });
});