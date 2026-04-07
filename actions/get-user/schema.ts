import { z } from "zod";

export const getUser = z.object({
  id: z.string(),
  userId: z.string().min(1, "UserId obrigatório"),
});
