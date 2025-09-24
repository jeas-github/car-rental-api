import { Client } from "@prisma/client";
import { IClientsRepository } from "../repositories/I-clients-repository";
import bcrypt from "bcrypt";
import { ClientAlreadyExistsError } from "./erros/client-already-exists-error";

interface CreateClientUseCaseRequest {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  birthDate: Date;
  password_hash: string;
  status?: "ativo" | "inativo";
}

interface CreateClientUseCaseResponse {
  client: Client;
}

export class CreateClientUseCase {
  constructor(private clientsRepository: IClientsRepository) {}

  async execute({
    name,
    cpf,
    email,
    phone,
    birthDate,
    password_hash,
    status,
  }: CreateClientUseCaseRequest): Promise<CreateClientUseCaseResponse> {
    const clientWithSameEmail = await this.clientsRepository.findByEmail(email);

    if (clientWithSameEmail) {
      throw new ClientAlreadyExistsError();
    }

    const hashedPassword = await bcrypt.hash(password_hash, 10);

    const client = await this.clientsRepository.create({
      name,
      cpf,
      email,
      phone,
      birthDate,
      password: hashedPassword,
      status,
    });

    return {
      client,
    };
  }
}
