import { Car, Prisma } from "@prisma/client";

export interface ICarsRepository {
  create(data: Prisma.CarCreateInput): Promise<Car>;
  findById(id: string): Promise<Car | null>;
  findByLicensePlate(plate: string): Promise<Car | null>;
  findMany(): Promise<Car[]>;
  update(id: string, data: Prisma.CarUpdateInput): Promise<Car>;
  delete(id: string): Promise<void>;
}
