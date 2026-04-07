import { z } from "zod";

export const DeleteUser = z.object({
  id: z.string(),
  userId: z.string().min(1, "UserId obrigatório"),
});
