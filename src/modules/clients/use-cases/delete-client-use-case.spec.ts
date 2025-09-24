import { beforeEach, describe, expect, it } from "vitest";
import { DeleteClientUseCase } from "./delete-client-use-case";
import { InMemoryClientsRepository } from "../repositories/in-memory/in-memory-clients-repository";
import { ResourceNotFoundError } from "./erros/resource-not-found-error";

let clientsRepository: InMemoryClientsRepository;
let sut: DeleteClientUseCase;

describe("Delete Client Use Case", () => {
  beforeEach(() => {
    clientsRepository = new InMemoryClientsRepository();
    sut = new DeleteClientUseCase(clientsRepository);
  });

  it("should be able to delete a client", async () => {
    const createdClient = await clientsRepository.create({
      name: "Client to Delete", cpf: "123", email: "delete@me.com", phone: "1", birthDate: new Date(), password: "123",
    });

    await sut.execute({ clientId: createdClient.clientId });

    expect(clientsRepository.items).toHaveLength(0);
  });

  it("should throw an error if client to delete is not found", async () => {
    await expect(sut.execute({ clientId: "non-existing-id" })).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });
});
