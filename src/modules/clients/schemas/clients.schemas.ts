import { z } from "zod";

export const clientParamsSchema = z.object({
  id: z.string().uuid(),
});

export const createClientBodySchema = z.object({
  name: z.string().min(2),
  cpf: z.string().length(11),
  email: z.string().email(),
  phone: z.string(),
  birthDate: z.string().transform((str) => new Date(str)),
  password: z.string().min(8),
  status: z.enum(["ativo", "inativo"]).optional(),
});

export const updateClientBodySchema = createClientBodySchema.partial();

export const clientResponseSchema = z.object({
  clientId: z.string().uuid(),
  name: z.string(),
  cpf: z.string(),
  email: z.string().email(),
  phone: z.string(),
  birthDate: z.date(),
  status: z.enum(["ativo", "inativo"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createClientResponseSchema = z.object({
  message: z.string(),
  client: clientResponseSchema,
});

export const updateClientResponseSchema = z.object({
  message: z.string(),
  client: clientResponseSchema,
});
