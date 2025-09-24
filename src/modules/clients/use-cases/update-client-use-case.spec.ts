import { beforeEach, describe, expect, it } from "vitest";
import { UpdateClientUseCase } from "./update-client-use-case";
import { InMemoryClientsRepository } from "../repositories/in-memory/in-memory-clients-repository";
import { ResourceNotFoundError } from "./erros/resource-not-found-error";
import { ClientAlreadyExistsError } from "./erros/client-already-exists-error";


let clientsRepository: InMemoryClientsRepository;
let sut: UpdateClientUseCase;

describe("Update Client Use Case", () => {
  beforeEach(() => {
    clientsRepository = new InMemoryClientsRepository();
    sut = new UpdateClientUseCase(clientsRepository);
  });

  it("should be able to update a client", async () => {
    const createdClient = await clientsRepository.create({
      name: "Old Name", cpf: "12345678901", email: "old@email.com", phone: "1", birthDate: new Date(), password: "123",
    });

    const { client } = await sut.execute({
      clientId: createdClient.clientId,
      name: "New Name",
      email: "new@email.com",
    });

    expect(client.name).toBe("New Name");
    expect(client.email).toBe("new@email.com");
  });

  it("should throw an error if client to update is not found", async () => {
    await expect(
      sut.execute({ clientId: "non-existing-id", name: "Any Name" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to update to an email that already exists", async () => {
    await clientsRepository.create({
      name: "Jane Doe", cpf: "10987654321", email: "existing@email.com", phone: "2", birthDate: new Date(), password: "456",
    });

    const clientToUpdate = await clientsRepository.create({
      name: "John Doe", cpf: "12345678901", email: "john@email.com", phone: "1", birthDate: new Date(), password: "123",
    });

    await expect(
      sut.execute({
        clientId: clientToUpdate.clientId,
        email: "existing@email.com",
      }),
    ).rejects.toBeInstanceOf(ClientAlreadyExistsError);
  });
});