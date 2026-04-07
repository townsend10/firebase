import { z } from "zod";

export const GetSchedule = z.object({
  id: z.string().min(1, "ID do agendamento é obrigatório"),
  userId: z.string().min(1, "UserId obrigatório"),
});
