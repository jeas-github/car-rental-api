import { prisma } from "@/lib/prisma";
import { Prisma, RentalPoint } from "@prisma/client";
import { IRentalPointsRepository } from "../I-rental-points-repository";

export class PrismaRentalPointsRepository implements IRentalPointsRepository {
  async create(data: Prisma.RentalPointCreateInput): Promise<RentalPoint> {
    const rentalPoint = await prisma.rentalPoint.create({
      data,
    });
    return rentalPoint;
  }

  async findByName(name: string): Promise<RentalPoint | null> {
    const rentalPoint = await prisma.rentalPoint.findUnique({
      where: { name },
    });
    return rentalPoint;
  }

  async findById(id: string): Promise<RentalPoint | null> {
    const rentalPoint = await prisma.rentalPoint.findUnique({
      where: { pointId: id },
    });
    return rentalPoint;
  }

  async findMany(): Promise<RentalPoint[]> {
    return prisma.rentalPoint.findMany({ orderBy: { name: "asc" } });
  }

  async update(
    id: string,
    data: Prisma.RentalPointUpdateInput,
  ): Promise<RentalPoint> {
    return prisma.rentalPoint.update({ where: { pointId: id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.rentalPoint.delete({ where: { pointId: id } });
  }
}
