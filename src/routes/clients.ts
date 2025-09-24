import { FastifyInstance } from "fastify";
import {
  create,
  getById,
  list,
  remove,
  update,
} from "@/modules/clients/controllers/clients-controller";

export async function clientsRoutes(app: FastifyInstance) {
  // Rota para criar um novo Cliente
  app.post("/", create);
  app.get("/", list);
  app.get("/:id", getById);
  app.patch("/:id", update);
  app.delete("/:id", remove);
}
