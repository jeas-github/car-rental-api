import { FastifyTypedInstance } from "@/types/types";
import {
   create,
   getById,
   list,
   remove,
   update,
} from "@/modules/cars/controllers/cars-controller";
import { z } from "zod";
import {
   carParamsSchema,
   carResponseSchema,
   createCarBodySchema,
   createCarResponseSchema,
   deleteCarResponseSchema,
   updateCarBodySchema,
   updateCarResponseSchema,
} from "@/modules/cars/schemas/cars.schemas";

export async function carsRoutes(app: FastifyTypedInstance) {
   app.post(
      "/",
      {
         schema: {
            summary: "Cria um novo carro",
            tags: ["Cars"],
            body: createCarBodySchema,
            response: {
               201: createCarResponseSchema,
               409: z.object({ message: z.string() }),
            },
         },
      },
      create
   );

   app.get(
      "/",
      {
         schema: {
            summary: "Lista todos os carros",
            tags: ["Cars"],
            response: {
               200: z.array(carResponseSchema), // Assuming list returns an array of cars
            },
         },
      },
      list
   );

   app.get(
      "/:id",
      {
         schema: {
            summary: "Busca um carro pelo ID",
            tags: ["Cars"],
            params: carParamsSchema,
            response: {
               200: carResponseSchema,
               404: z.object({ message: z.string() }),
            },
         },
      },
      getById
   );

   app.patch(
      "/:id",
      {
         schema: {
            summary: "Atualiza um carro pelo ID",
            tags: ["Cars"],
            params: carParamsSchema,
            body: updateCarBodySchema,
            response: {
               200: updateCarResponseSchema,
               404: z.object({ message: z.string() }),
               409: z.object({ message: z.string() }),
            },
         },
      },
      update
   );

   app.delete(
      "/:id",
      {
         schema: {
            summary: "Deleta um carro pelo ID",
            tags: ["Cars"],
            params: carParamsSchema,
            response: {
               200: deleteCarResponseSchema,
               404: z.object({ message: z.string() }),
            },
         },
      },
      remove
   );
}
