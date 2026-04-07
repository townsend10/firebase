import { z } from "zod";

export const UpdatePrescription = z.object({
  id: z.string(),
  content: z.string(),
  name: z.string(),
  date: z.coerce.date(),
  days: z.number(),
  userId: z.string().min(1, "UserId obrigatório"),
});
