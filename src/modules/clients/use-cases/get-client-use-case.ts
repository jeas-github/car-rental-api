import { Client } from "@prisma/client";
import { IClientsRepository } from "../repositories/I-clients-repository";
import { ResourceNotFoundError } from "./erros/resource-not-found-error";

interface GetClientUseCaseRequest {
  clientId: string;
}

interface GetClientUseCaseResponse {
  client: Client;
}

export class GetClientUseCase {
  constructor(private clientsRepository: IClientsRepository) {}

  async execute({
    clientId,
  }: GetClientUseCaseRequest): Promise<GetClientUseCaseResponse> {
    const client = await this.clientsRepository.findById(clientId);
    if (!client) throw new ResourceNotFoundError();
    return { client };
  }
}
