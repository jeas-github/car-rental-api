import { Prisma, Rental } from "@prisma/client";

export interface IRentalsRepository {
  create(data: Prisma.RentalCreateInput): Promise<Rental>;
  findById(id: string): Promise<Rental | null>;
  findManyByClientId(clientId: string): Promise<Rental[]>;
  findOpenRentalByCarId(carId: string): Promise<Rental | null>;
  findOpenRentalByClientId(clientId: string): Promise<Rental | null>;
  update(id: string, data: Prisma.RentalUpdateInput): Promise<Rental>;
}
