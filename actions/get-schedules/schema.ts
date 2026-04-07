import { z } from "zod";

export const GetSchedules = z.object({
  name: z.string().optional(),
  date: z.string().optional(),
  pacientId: z.string().optional(),
  hour: z.string().optional(),
  status: z.enum(["confirm", "cancelled", "waiting", "none"]).optional(),
  role: z.string().optional(),
  userId: z.string().optional(),
});
