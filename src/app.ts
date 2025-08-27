import fastify from "fastify";
import { carsRoutes } from "./routes/cars";

export const app = fastify();

app.register(carsRoutes, { prefix: "/api/cars" });
