import { z } from "zod";

export const GetAllPrescriptions = z.object({
  name: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  minDays: z.number().optional(),
  maxDays: z.number().optional(),
  currentUserId: z.string().min(1, "UserId obrigatório"),
});
