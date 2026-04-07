import { z } from "zod";

export const GetPrescriptions = z.object({
  id: z.string().optional(),
  content: z.string().optional(),
  name: z.string().optional(),
  userId: z.string().min(1, "UserId obrigatório"),
});
