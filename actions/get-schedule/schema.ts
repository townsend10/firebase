import { z } from "zod";

export const GetSchedule = z.object({
  id: z.string(),
});
