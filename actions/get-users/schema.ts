import { z } from "zod";

export const getUsers = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  id: z.string().optional(),
  userId: z.string().min(1, "UserId obrigatório"),
});
