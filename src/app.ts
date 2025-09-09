import fastify from "fastify";
import { carsRoutes } from "./routes/cars";
import { rentalPointsRoutes } from "./routes/rentalPoints";
import { clientsRoutes } from "./routes/clients";

export const app = fastify();

app.register(carsRoutes, { prefix: "/api/cars" });
app.register(rentalPointsRoutes, { prefix: "/api/rental-points" });
app.register(clientsRoutes, { prefix: "/api/clients" });
