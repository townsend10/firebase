import { z } from "zod";

export const GetSchedules = z.object({
  name: z.string(),
  date: z.string(),
  pacientId: z.string(),
  hour: z.string({
    required_error: "Defina uma hora",
  }),
  status: z.enum(["confirm", "cancelled", "waiting", "none"], {
    required_error: "Defina um status",
  }),
});
