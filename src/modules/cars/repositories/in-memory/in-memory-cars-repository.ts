import { Car, Prisma } from "@prisma/client";
import { ICarsRepository } from "../I-cars-repository";
import { randomUUID } from "node:crypto";

export class InMemoryCarsRepository implements ICarsRepository {
  public items: Car[] = [];

  async create(data: Prisma.CarCreateInput): Promise<Car> {
    const car: Car = {
      carId: data.carId ?? randomUUID(),
      licensePlate: data.licensePlate,
      brand: data.brand,
      model: data.model,
      year: data.year,
      category: data.category ?? "econômica",
      status: data.status ?? "disponível",
      dailyRate: new Prisma.Decimal(data.dailyRate as number),
      currentPointId: data.currentPoint.connect?.pointId as string,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.items.push(car);
    return car;
  }

  async findById(id: string): Promise<Car | null> {
    const car = this.items.find((item) => item.carId === id);
    return car || null;
  }

  async findByLicensePlate(plate: string): Promise<Car | null> {
    const car = this.items.find((item) => item.licensePlate === plate);
    return car || null;
  }

  async findMany(): Promise<Car[]> {
    return this.items.sort((a, b) => {
      if (a.brand < b.brand) return -1;
      if (a.brand > b.brand) return 1;
      return a.model.localeCompare(b.model);
    });
  }

  async update(id: string, data: Prisma.CarUpdateInput): Promise<Car> {
    const carIndex = this.items.findIndex((item) => item.carId === id);
    const car = this.items[carIndex];

    if (data.dailyRate)
      car.dailyRate = new Prisma.Decimal(data.dailyRate as number);
    if (data.currentPoint?.connect?.pointId)
      car.currentPointId = data.currentPoint.connect.pointId;

    Object.assign(car, { ...data, updatedAt: new Date() });

    this.items[carIndex] = car;
    return car;
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.carId === id);
    if (index > -1) this.items.splice(index, 1);
  }
}
