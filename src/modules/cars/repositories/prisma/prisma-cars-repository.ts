import { prisma } from "@/lib/prisma";
import { Car, Prisma } from "@prisma/client";
import { ICarsRepository } from "../I-cars-repository";

export class PrismaCarsRepository implements ICarsRepository {
  async create(data: Prisma.CarCreateInput): Promise<Car> {
    return prisma.car.create({ data });
  }

  async findById(id: string): Promise<Car | null> {
    return prisma.car.findUnique({ where: { carId: id } });
  }

  async findByLicensePlate(plate: string): Promise<Car | null> {
    return prisma.car.findUnique({ where: { licensePlate: plate } });
  }

  async findMany(): Promise<Car[]> {
    return prisma.car.findMany({
      orderBy: [{ brand: "asc" }, { model: "asc" }],
    });
  }

  async update(id: string, data: Prisma.CarUpdateInput): Promise<Car> {
    return prisma.car.update({
      where: { carId: id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.car.delete({
      where: { carId: id },
    });
  }
}
