import { z } from "zod";

export const GetAllPrescriptions = z.object({
  // Optional search parameters
  name: z.string().optional(),
  userId: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  minDays: z.number().optional(),
  maxDays: z.number().optional(),
});
