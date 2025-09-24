import { Client, Prisma } from "@prisma/client";
import { IClientsRepository } from "../I-clients-repository";
import { randomUUID } from "node:crypto";

export class InMemoryClientsRepository implements IClientsRepository {
  public items: Client[] = [];

  async create(data: Prisma.ClientCreateInput): Promise<Client> {
    const client: Client = {
      clientId: data.clientId ?? randomUUID(),
      name: data.name,
      cpf: data.cpf,
      email: data.email,
      phone: data.phone,
      birthDate: new Date(data.birthDate),
      password: data.password,
      status: data.status ?? "ativo",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.items.push(client);
    return client;
  }

  async findById(id: string): Promise<Client | null> {
    const client = this.items.find((item) => item.clientId === id);
    return client || null;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = this.items.find((item) => item.email === email);
    return client || null;
  }

  async findMany(): Promise<Client[]> {
    return this.items.sort((a, b) => a.name.localeCompare(b.name));
  }

  async update(id: string, data: Prisma.ClientUpdateInput): Promise<Client> {
    const clientIndex = this.items.findIndex((item) => item.clientId === id);
    const client = this.items[clientIndex];

    // Atualiza os campos, garantindo que a data seja um objeto Date
    if (data.birthDate) data.birthDate = new Date(data.birthDate as string);

    Object.assign(client, { ...data, updatedAt: new Date() });

    this.items[clientIndex] = client;
    return client;
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.clientId === id);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }
}
