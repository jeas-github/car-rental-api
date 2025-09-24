import { FastifyTypedInstance } from "@/types/types";
import {
  create,
  list,
  getById,
  update,
  remove,
} from "@/modules/cars/controllers/cars-controller";

export async function carsRoutes(app: FastifyTypedInstance) {
  app.post("/cars", create);

  app.get("/cars", list);

  app.get("/cars/:id", getById);

  app.patch("/cars/:id", update);

  app.delete("/cars/:id", remove);
}
