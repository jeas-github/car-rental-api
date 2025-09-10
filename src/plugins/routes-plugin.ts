// src/plugins/routes-plugin.ts

import { FastifyPluginAsync } from "fastify";
import { carsRoutes } from "../routes/cars";
import { rentalPointsRoutes } from "../routes/rentalPoints";
import { clientsRoutes } from "../routes/clients";

const routesPlugin: FastifyPluginAsync = async (app) => {
  // Registre todas as rotas da sua API dentro deste plugin
  app.register(carsRoutes, { prefix: "/api/cars" });
  app.register(rentalPointsRoutes, { prefix: "/api/rental-points" });
  app.register(clientsRoutes, { prefix: "/api/clients" });
};

export default routesPlugin;
