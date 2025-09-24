import { Prisma, Rental } from "@prisma/client";
import { IRentalsRepository } from "../I-rentals-repository";
import { randomUUID } from "node:crypto";
import { Decimal } from "@prisma/client/runtime/library";

export class InMemoryRentalsRepository implements IRentalsRepository {
  public items: Rental[] = [];

  async create(data: Prisma.RentalCreateInput): Promise<Rental> {
    const rental: Rental = {
      rentalId: data.rentalId ?? randomUUID(),
      carId: data.car.connect?.carId as string,
      clientId: data.client.connect?.clientId as string,
      pickupPointId: data.pickupPoint.connect?.pointId as string,
      returnPointId: data.pickupPoint.connect?.pointId as string,
      pickupDate: new Date(),
      returnDate: new Date(data.returnDate as Date),
      finalValue: Decimal(100),
      status: "ativo",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.items.push(rental);
    return rental;
  }

  async findById(id: string): Promise<Rental | null> {
    return this.items.find((item) => item.rentalId === id) || null;
  }

  async findManyByClientId(clientId: string): Promise<Rental[]> {
    return this.items.filter((item) => item.clientId === clientId);
  }

  async findOpenRentalByCarId(carId: string): Promise<Rental | null> {
    return (
      this.items.find(
        (item) => item.carId === carId && item.status === "ativo",
      ) || null
    );
  }

  async findOpenRentalByClientId(clientId: string): Promise<Rental | null> {
    return (
      this.items.find(
        (item) => item.clientId === clientId && item.status === "ativo",
      ) || null
    );
  }

  async update(id: string, data: Prisma.RentalUpdateInput): Promise<Rental> {
    const rentalIndex = this.items.findIndex((item) => item.rentalId === id);
    const rental = this.items[rentalIndex];

    Object.assign(rental, { ...data, updatedAt: new Date() });

    this.items[rentalIndex] = rental;
    return rental;
  }
}
