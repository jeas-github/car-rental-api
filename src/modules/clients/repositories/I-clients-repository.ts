import { Client, Prisma } from "@prisma/client";

export interface IClientsRepository {
  create(data: Prisma.ClientCreateInput): Promise<Client>;
  findById(id: string): Promise<Client | null>;
  findByEmail(email: string): Promise<Client | null>;
  findMany(): Promise<Client[]>;
  update(id: string, data: Prisma.ClientUpdateInput): Promise<Client>;
  delete(id: string): Promise<void>;
}
