import { InMemoryCarsRepository } from "@/modules/cars/repositories/in-memory/in-memory-cars-repository";
import { InMemoryClientsRepository } from "@/modules/clients/repositories/in-memory/in-memory-clients-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateRentalUseCase } from "./create-rental-use-case";
import { InMemoryRentalsRepository } from "../repositories/in-memory/in-memory-rentals-repository";
import { CarNotAvailableError } from "./errors/car-not-available-error";
import { ClientHasOpenRentalError } from "./errors/client-has-open-rental-error";


let rentalsRepository: InMemoryRentalsRepository;
let carsRepository: InMemoryCarsRepository;
let clientsRepository: InMemoryClientsRepository;
let sut: CreateRentalUseCase;

describe("Create Rental Use Case", () => {
  beforeEach(() => {
    rentalsRepository = new InMemoryRentalsRepository();
    carsRepository = new InMemoryCarsRepository();
    clientsRepository = new InMemoryClientsRepository();
    sut = new CreateRentalUseCase(
      rentalsRepository,
      carsRepository,
      clientsRepository,
    );

    // Pré-cadastrar um carro e um cliente para os testes
    carsRepository.create({
      carId: "car-01",
      licensePlate: "ABC-1234",
      brand: "Test Brand",
      model: "Test Model",
      year: 2023,
      dailyRate: 100,
      status: "disponível",
      currentPoint: { connect: { pointId: "point-01" } },
    });

    clientsRepository.create({
      clientId: "client-01",
      name: "John Doe",
      cpf: "12345678901",
      email: "john@doe.com",
      phone: "11999999999",
      birthDate: new Date(),
      password: "hashed_password",
    });
  });

  it("should be able to create a new rental", async () => {
    const { rental } = await sut.execute({
      carId: "car-01",
      clientId: "client-01",
      pickupPointId: "point-01",
      expectedReturnDate: new Date("2025-01-01"),
      pickupDate: new Date("2024-12-25"),
    });

    expect(rental.rentalId).toEqual(expect.any(String));
    expect(rental.carId).toBe("car-01");

    // Verifica se o status do carro foi atualizado
    const car = await carsRepository.findById("car-01");
    expect(car?.status).toBe("alugado");
  });

  it("should not be able to create a rental for an unavailable car", async () => {
    // Aluga o carro uma vez
    await sut.execute({
      carId: "car-01",
      clientId: "client-01",
      pickupPointId: "point-01",
      pickupDate: new Date("2024-12-25"),
      expectedReturnDate: new Date("2025-01-01"),
    });

    // Tenta alugar o mesmo carro para outro cliente
    await clientsRepository.create({ clientId: "client-02", name: "Jane Doe", cpf: "10987654321", email: "jane@doe.com", phone: "11888888888", birthDate: new Date(), password: "hashed_password" });

    await expect(
      sut.execute({
        carId: "car-01",
        clientId: "client-02",
        pickupPointId: "point-01",
        pickupDate: new Date("2024-12-25"),
        expectedReturnDate: new Date("2025-02-01"),
      }),
    ).rejects.toBeInstanceOf(CarNotAvailableError);
  });

  it("should not be able to create a rental for a client who already has an open rental", async () => {
    // Cria outro carro disponível
    await carsRepository.create({ carId: "car-02", licensePlate: "DEF-5678", brand: "Test Brand", model: "Test Model 2", year: 2024, dailyRate: 150, status: "disponível", currentPoint: { connect: { pointId: "point-01" } } });

    // Cliente aluga o primeiro carro
    await sut.execute({
      carId: "car-01", 
      clientId: "client-01",
      pickupPointId: "point-01",
      pickupDate: new Date("2024-12-25"),
      expectedReturnDate: new Date("2025-01-01")
    });

    // Tenta alugar o segundo carro com o mesmo cliente
    await expect(
      sut.execute({
        carId: "car-02", 
        clientId: "client-01", 
        pickupPointId: "point-01", 
        pickupDate: new Date("2024-12-25"), 
        expectedReturnDate: new Date("2025-02-01") 
      }),
    ).rejects.toBeInstanceOf(ClientHasOpenRentalError);
  });
});
