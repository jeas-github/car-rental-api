import { IClientsRepository } from "../repositories/I-clients-repository";
import { ResourceNotFoundError } from "./erros/resource-not-found-error";

interface DeleteClientUseCaseRequest {
  clientId: string;
}

export class DeleteClientUseCase {
  constructor(private clientsRepository: IClientsRepository) {}

  async execute({ clientId }: DeleteClientUseCaseRequest): Promise<void> {
    const client = await this.clientsRepository.findById(clientId);

    if (!client) throw new ResourceNotFoundError();

    await this.clientsRepository.delete(clientId);
  }
}
