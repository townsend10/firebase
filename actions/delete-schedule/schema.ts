import { z } from "zod";

export const DeleteSchedule = z.object({
  id: z.string(),
});
