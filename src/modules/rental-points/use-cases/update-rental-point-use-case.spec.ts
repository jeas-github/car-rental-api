import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryRentalPointsRepository } from "../repositories/in-memory/in-memory-rental-points-repository";
import { UpdateRentalPointUseCase } from "./update-rental-point-use-case";
import { ResourceNotFoundError } from "../../shared/errors/resource-not-found-error";
import { RentalPointAlreadyExistsError } from "./errors/rental-point-already-exists-error";

let rentalPointsRepository: InMemoryRentalPointsRepository;
let sut: UpdateRentalPointUseCase;

describe("Update Rental Point Use Case", () => {
  beforeEach(() => {
    rentalPointsRepository = new InMemoryRentalPointsRepository();
    sut = new UpdateRentalPointUseCase(rentalPointsRepository);
  });

  it("should be able to update a rental point", async () => {
    const createdPoint = await rentalPointsRepository.create({
      name: "Nome Antigo",
    });

    const { rentalPoint } = await sut.execute({
      id: createdPoint.pointId,
      name: "Nome Novo",
      status: "ativo",
    });

    expect(rentalPoint.name).toBe("Nome Novo");
    expect(rentalPoint.status).toBe("ativo");
    expect(rentalPoint.pointId).toBe(createdPoint.pointId);
    expect(rentalPoint.updatedAt).toBeInstanceOf(Date);
  });

  it("should throw an error if rental point to update is not found", async () => {
    await expect(
      sut.execute({ id: "non-existing-id", name: "Qualquer Nome" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to update to a name that already exists", async () => {
    await rentalPointsRepository.create({
      name: "Nome Existente",
    });
    const pointToUpdate = await rentalPointsRepository.create({
      name: "Nome Original",
    });

    await expect(
      sut.execute({
        id: pointToUpdate.pointId,
        name: "Nome Existente",
      }),
    ).rejects.toBeInstanceOf(RentalPointAlreadyExistsError);
  });
});