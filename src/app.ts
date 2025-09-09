import AdminJS from "adminjs";
import fastify from "fastify";
import AdminJSFastify from "@adminjs/fastify";
import { Database, Resource, getModelByName } from "@adminjs/prisma";

import { prisma } from "@/lib/prisma";
import { carsRoutes } from "./routes/cars";
import { rentalPointsRoutes } from "./routes/rentalPoints";
import { clientsRoutes } from "./routes/clients";

export const app = fastify();

AdminJS.registerAdapter({ Database, Resource });

const adminOptions = {
  resources: [
    {
      resource: { model: getModelByName("RentalPoint"), client: prisma },
      options: {},
    },
  ],
  databases: [],
  rootPath: "/admin",
};

const admin = new AdminJS(adminOptions);

await AdminJSFastify.buildRouter(admin, app);

app.register(carsRoutes, { prefix: "/api/cars" });
app.register(rentalPointsRoutes, { prefix: "/api/rental-points" });
app.register(clientsRoutes, { prefix: "/api/clients" });
