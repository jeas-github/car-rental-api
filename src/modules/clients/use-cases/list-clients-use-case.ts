import { Client } from "@prisma/client";
import { IClientsRepository } from "../repositories/I-clients-repository";

interface ListClientsUseCaseResponse {
  clients: Client[];
}

export class ListClientsUseCase {
  constructor(private clientsRepository: IClientsRepository) {}

  async execute(): Promise<ListClientsUseCaseResponse> {
    const clients = await this.clientsRepository.findMany();
    return { clients };
  }
}
