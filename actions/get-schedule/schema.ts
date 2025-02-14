import { z } from "zod";

export const GetSchedule = z.object({
  id: z.string(),

  date: z.string(),
  hour: z.string({
    required_error: "Defina uma hora",
  }),
  status: z.enum(["confirm", "cancelled", "waiting", "none"], {
    required_error: "Defina um status",
  }),
});
