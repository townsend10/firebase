import { z } from "zod";

export const GetPrescriptions = z.object({
  id: z.string({}),
  content: z.string({}),
  name: z.string()
});
