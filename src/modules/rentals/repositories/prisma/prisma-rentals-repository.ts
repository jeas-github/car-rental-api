import { prisma } from "@/lib/prisma";
import { Prisma, Rental } from "@prisma/client";
import { IRentalsRepository } from "../I-rentals-repository";

export class PrismaRentalsRepository implements IRentalsRepository {
  async create(data: Prisma.RentalCreateInput): Promise<Rental> {
    return prisma.rental.create({ data });
  }

  async findById(id: string): Promise<Rental | null> {
    return prisma.rental.findUnique({ where: { rentalId: id } });
  }

  async findManyByClientId(clientId: string): Promise<Rental[]> {
    return prisma.rental.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOpenRentalByCarId(carId: string): Promise<Rental | null> {
    return prisma.rental.findFirst({
      where: { carId, status: "ativo" },
    });
  }

  async findOpenRentalByClientId(clientId: string): Promise<Rental | null> {
    return prisma.rental.findFirst({
      where: {
        clientId,
        status: "ativo",
      },
    });
  }

  async update(id: string, data: Prisma.RentalUpdateInput): Promise<Rental> {
    return prisma.rental.update({
      where: { rentalId: id },
      data,
    });
  }
}
