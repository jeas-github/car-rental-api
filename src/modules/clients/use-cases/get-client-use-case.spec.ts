import { beforeEach, describe, expect, it } from "vitest";
import { GetClientUseCase } from "./get-client-use-case";
import { InMemoryClientsRepository } from "../repositories/in-memory/in-memory-clients-repository";
import { ResourceNotFoundError } from "./erros/resource-not-found-error";

let clientsRepository: InMemoryClientsRepository;
let sut: GetClientUseCase;

describe("Get Client Use Case", () => {
  beforeEach(() => {
    clientsRepository = new InMemoryClientsRepository();
    sut = new GetClientUseCase(clientsRepository);
  });

  it("should be able to get a client by id", async () => {
    const createdClient = await clientsRepository.create({
      name: "John Doe", cpf: "12345678901", email: "j@d.com", phone: "1", birthDate: new Date(), password: "123",
    });

    const { client } = await sut.execute({ clientId: createdClient.clientId });

    expect(client.clientId).toBe(createdClient.clientId);
    expect(client.name).toBe("John Doe");
  });

  it("should throw an error if client is not found", async () => {
    await expect(sut.execute({ clientId: "non-existing-id" })).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });
});
