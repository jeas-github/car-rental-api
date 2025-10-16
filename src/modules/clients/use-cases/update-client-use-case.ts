import { Client } from "@prisma/client";
import { IClientsRepository } from "../repositories/I-clients-repository";
import { ResourceNotFoundError } from "./erros/resource-not-found-error";
import { ClientAlreadyExistsError } from "./erros/client-already-exists-error";
import bcrypt from "bcrypt";

interface UpdateClientUseCaseRequest {
  clientId: string;
  name?: string;
  cpf?: string;
  email?: string;
  phone?: string;
  birthDate?: Date;
  password?: string;
  status?: "ativo" | "inativo";
}

interface UpdateClientUseCaseResponse {
  client: Client;
}

export class UpdateClientUseCase {
  constructor(private clientsRepository: IClientsRepository) {}

  async execute({
    clientId,
    ...data
  }: UpdateClientUseCaseRequest): Promise<UpdateClientUseCaseResponse> {
    const clientToUpdate = await this.clientsRepository.findById(clientId);
    if (!clientToUpdate) throw new ResourceNotFoundError();

    if (data.email) {
      const clientWithSameEmail = await this.clientsRepository.findByEmail(
        data.email,
      );
      if (clientWithSameEmail && clientWithSameEmail.clientId !== clientId) {
        throw new ClientAlreadyExistsError();
      }
    }

    const dataToUpdate: { [key: string]: any } = { ...data };

    if (data.password) {
      dataToUpdate.password = await bcrypt.hash(data.password, 10);
    }

    const client = await this.clientsRepository.update(clientId, dataToUpdate);

    return { client };
  }
}
