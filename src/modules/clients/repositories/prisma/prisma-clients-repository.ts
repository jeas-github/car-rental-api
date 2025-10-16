import { prisma } from "@/lib/prisma";
import { Client, Prisma } from "@prisma/client";
import { IClientsRepository } from "../I-clients-repository";

export class PrismaClientsRepository implements IClientsRepository {
  async create(data: Prisma.ClientCreateInput): Promise<Client> {
    return prisma.client.create({ data });
  }

  async findById(id: string): Promise<Client | null> {
    return prisma.client.findUnique({ where: { clientId: id } });
  }

  async findByEmail(email: string): Promise<Client | null> {
    return prisma.client.findUnique({ where: { email } });
  }

  async findMany(): Promise<Client[]> {
    return prisma.client.findMany({
      orderBy: { name: "asc" },
    });
  }

  async update(id: string, data: Prisma.ClientUpdateInput): Promise<Client> {
    return prisma.client.update({
      where: { clientId: id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.client.delete({ where: { clientId: id } });
  }
}
