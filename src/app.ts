import fastify from "fastify";
import { carsRoutes } from "./routes/cars";
import { rentalPointsRoutes } from "./routes/rentalPoints";

export const app = fastify();

app.register(carsRoutes, { prefix: "/api/cars" });
app.register(rentalPointsRoutes, { prefix: "/api/rental-points" });
