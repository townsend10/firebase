import { z } from "zod";

export const GetPrescription = z.object({
  content: z.string(),
  id: z.string(),
  name: z.optional(z.string()),
});
