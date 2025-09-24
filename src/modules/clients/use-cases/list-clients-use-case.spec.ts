import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryClientsRepository } from "../repositories/in-memory/in-memory-clients-repository";
import { ListClientsUseCase } from "./list-clients-use-case";

let clientsRepository: InMemoryClientsRepository;
let sut: ListClientsUseCase;

describe("List Clients Use Case", () => {
  beforeEach(() => {
    clientsRepository = new InMemoryClientsRepository();
    sut = new ListClientsUseCase(clientsRepository);
  });

  it("should be able to list all clients, ordered by name", async () => {
    await clientsRepository.create({ name: "Zoe", cpf: "3", email: "c@c.com", phone: "3", birthDate: new Date(), password: "3" });
    await clientsRepository.create({ name: "Adam", cpf: "1", email: "a@a.com", phone: "1", birthDate: new Date(), password: "1" });
    await clientsRepository.create({ name: "Mary", cpf: "2", email: "b@b.com", phone: "2", birthDate: new Date(), password: "2" });

    const { clients } = await sut.execute();

    expect(clients).toHaveLength(3);
    expect(clients[0].name).toBe("Adam");
    expect(clients[1].name).toBe("Mary");
    expect(clients[2].name).toBe("Zoe");
  });

  it("should return an empty array when no clients exist", async () => {
    const { clients } = await sut.execute();

    expect(clients).toHaveLength(0);
  });
});