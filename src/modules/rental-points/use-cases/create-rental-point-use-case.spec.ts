import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryRentalPointsRepository } from "../repositories/in-memory/in-memory-rental-points-repository";
import { CreateRentalPointUseCase } from "./create-rental-point-use-case";
import { RentalPointAlreadyExistsError } from "./errors/rental-point-already-exists-error";

let rentalPointsRepository: InMemoryRentalPointsRepository;
let sut: CreateRentalPointUseCase; // sut: System Under Test

describe("Create Rental Point Use Case", () => {
  beforeEach(() => {
    rentalPointsRepository = new InMemoryRentalPointsRepository();
    sut = new CreateRentalPointUseCase(rentalPointsRepository);
  });

  it("should be able to create a new rental point", async () => {
    const { rentalPoint } = await sut.execute({
      name: "Aeroporto de Guarulhos",
      status: "ativo",
    });

    expect(rentalPoint.pointId).toEqual(expect.any(String));
    expect(rentalPoint.name).toBe("Aeroporto de Guarulhos");
  });

  it("should not be able to create a rental point with a duplicate name", async () => {
    await sut.execute({
      name: "Aeroporto de Guarulhos",
    });

    await expect(() =>
      sut.execute({ name: "Aeroporto de Guarulhos" }),
    ).rejects.toBeInstanceOf(RentalPointAlreadyExistsError);
  });
});