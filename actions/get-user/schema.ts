import { z } from "zod";

export const getUser = z.object({
  name: z.string(),

  phone: z.string(),
  id: z.string(),
  imageUrl: z.any(),
  email: z.string(),
  cpf: z.string(),
});
