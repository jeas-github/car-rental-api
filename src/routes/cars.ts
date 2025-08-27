import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function carsRoutes(app: FastifyInstance) {
  app.post("/", async (request, replay) => {
    const createCarBodySchema = z.object({
      plate: z.string().regex(/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/i, {
        message: "A placa deve seguir o formato 'ABC1D23'.",
      }),
      brand: z.string().min(2),
      model: z.string().min(2),
      year: z.number().int().min(2015),
      daily_price: z.number().positive(),
    });

    const body = createCarBodySchema.parse(request.body);

    return replay.status(201).send(body);
  });

  app.get("/", async () => {
    return { message: `List of cars` };
  });
}
