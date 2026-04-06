import { z } from "zod";

export const DeleteSchedule = z.object({
  id: z.string().min(1, "ID do agendamento é obrigatório"),
});
