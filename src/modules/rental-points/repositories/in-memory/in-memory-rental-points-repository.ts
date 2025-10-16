import { Prisma, RentalPoint } from "@prisma/client";
import { IRentalPointsRepository } from "../I-rental-points-repository";
import { randomUUID } from "node:crypto";

export class InMemoryRentalPointsRepository implements IRentalPointsRepository {
  public items: RentalPoint[] = [];

  async create(data: Prisma.RentalPointCreateInput): Promise<RentalPoint> {
    const rentalPoint: RentalPoint = {
      pointId: data.pointId ?? randomUUID(),
      name: data.name,
      status: data.status ?? "ativo",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.items.push(rentalPoint);
    return rentalPoint;
  }

  async findByName(name: string): Promise<RentalPoint | null> {
    const rentalPoint = this.items.find((item) => item.name === name);
    return rentalPoint || null;
  }

  async findById(id: string): Promise<RentalPoint | null> {
    const rentalPoint = this.items.find((item) => item.pointId === id);
    return rentalPoint || null;
  }

  async findMany(): Promise<RentalPoint[]> {
    return this.items.sort((a, b) => a.name.localeCompare(b.name));
  }

  async update(
    id: string,
    data: Prisma.RentalPointUpdateInput,
  ): Promise<RentalPoint> {
    const rentalPointIndex = this.items.findIndex(
      (item) => item.pointId === id,
    );
    const rentalPoint = this.items[rentalPointIndex];

    Object.assign(rentalPoint, { ...data, updatedAt: new Date() });

    this.items[rentalPointIndex] = rentalPoint;
    return rentalPoint;
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.pointId === id);
    this.items.splice(index, 1);
  }
}
