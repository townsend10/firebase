import { z } from "zod";

export const UpdateSchedule = z.object({
  id: z.string(),
  date: z.string({ required_error: "Data obrigatória" }),
  hour: z.string({ required_error: "Hora obrigatória" }),
  status: z.enum(["confirm", "cancelled", "waiting", "none"]).optional(),
  userId: z.string().min(1, "UserId obrigatório"),
});
