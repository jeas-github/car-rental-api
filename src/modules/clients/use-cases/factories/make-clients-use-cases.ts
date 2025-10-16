import { PrismaClientsRepository } from "../../repositories/prisma/prisma-clients-repository";
import { CreateClientUseCase } from "../create-client-use-case";
import { DeleteClientUseCase } from "../delete-client-use-case";
import { GetClientUseCase } from "../get-client-use-case";
import { ListClientsUseCase } from "../list-clients-use-case";
import { UpdateClientUseCase } from "../update-client-use-case";

export function makeCreateClientUseCase() {
  const clientsRepository = new PrismaClientsRepository();
  const useCase = new CreateClientUseCase(clientsRepository);
  return useCase;
}

export function makeListClientsUseCase() {
  const clientsRepository = new PrismaClientsRepository();
  const useCase = new ListClientsUseCase(clientsRepository);
  return useCase;
}

export function makeGetClientUseCase() {
  const clientsRepository = new PrismaClientsRepository();
  const useCase = new GetClientUseCase(clientsRepository);
  return useCase;
}

export function makeUpdateClientUseCase() {
  const clientsRepository = new PrismaClientsRepository();
  const useCase = new UpdateClientUseCase(clientsRepository);
  return useCase;
}

export function makeDeleteClientUseCase() {
  const clientsRepository = new PrismaClientsRepository();
  const useCase = new DeleteClientUseCase(clientsRepository);
  return useCase;
}
