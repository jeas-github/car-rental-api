import { beforeEach, describe, expect, it } from "vitest";
import { CreateClientUseCase } from "./create-client-use-case";
import bcrypt from "bcrypt";
import { InMemoryClientsRepository } from "../repositories/in-memory/in-memory-clients-repository";
import { ClientAlreadyExistsError } from "./erros/client-already-exists-error";

let clientsRepository: InMemoryClientsRepository;
let sut: CreateClientUseCase;

describe("Create Client Use Case", () => {
  beforeEach(() => {
    clientsRepository = new InMemoryClientsRepository();
    sut = new CreateClientUseCase(clientsRepository);
  });

  it("should be able to create a new client", async () => {
    const { client } = await sut.execute({
      name: "John Doe",
      cpf: "12345678901",
      email: "johndoe@example.com",
      phone: "11999999999",
      birthDate: new Date("1990-01-01"),
      password_hash: "password123",
    });

    expect(client.clientId).toEqual(expect.any(String));
    expect(client.name).toBe("John Doe");

    const isPasswordCorrectlyHashed = await bcrypt.compare(
      "password123",
      client.password,
    );
    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to create a client with a duplicate email", async () => {
    const email = "johndoe@example.com";
    await sut.execute({
      name: "John Doe",
      cpf: "12345678901",
      email,
      phone: "11999999999",
      birthDate: new Date("1990-01-01"),
      password_hash: "password123",
    });

    await expect(() =>
      sut.execute({ name: "Jane Doe", cpf: "10987654321", email, phone: "11888888888", birthDate: new Date("1992-02-02"), password_hash: "password456" }),
    ).rejects.toBeInstanceOf(ClientAlreadyExistsError);
  });
});
