import { Prisma, RentalPoint } from "@prisma/client";

export interface IRentalPointsRepository {
  create(data: Prisma.RentalPointCreateInput): Promise<RentalPoint>;
  findByName(name: string): Promise<RentalPoint | null>;
  findById(id: string): Promise<RentalPoint | null>;
  findMany(): Promise<RentalPoint[]>;
  update(id: string, data: Prisma.RentalPointUpdateInput): Promise<RentalPoint>;
  delete(id: string): Promise<void>;
}
