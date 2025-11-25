import { z } from "zod";

export const CreateSchedule = z.object({
  pacientId: z.string(),
  date: z.string({ required_error: "Insira uma data" }),
  hour: z.string({
    required_error: "Defina uma hora",
  }),
  status: z.enum(["confirm", "cancelled", "waiting", "none"], {
    required_error: "Defina um status",
  }),
  userId: z.string().optional(), // For tracking who created the appointment
  userRole: z.enum(["admin", "guest"]).optional(), // For validation rules
});
