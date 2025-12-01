import { z } from "zod";

export const UpdateSchedule = z.object({
  id: z.string(),
  date: z.string({
    required_error: "Data é obrigatória",
  }),
  hour: z.string({
    required_error: "Hora é obrigatória",
  }),
  status: z.enum(["confirm", "cancelled", "waiting", "none"]).optional(),
});
