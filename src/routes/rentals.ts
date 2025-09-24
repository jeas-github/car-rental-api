import { FastifyTypedInstance } from "@/types/types";
import {
  create,
  returnCar,
} from "@/modules/rentals/controllers/rentals-controller";

export async function rentalsRoutes(app: FastifyTypedInstance) {
  app.post("/", create);

  app.patch("/:id/return", returnCar);
}
