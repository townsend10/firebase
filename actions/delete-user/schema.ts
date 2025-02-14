import { z } from "zod";

export const DeleteUser = z.object({
  id: z.string(),
});
