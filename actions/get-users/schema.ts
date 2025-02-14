import { z } from "zod";

export const getUsers = z.object({
  name: z.string(),

  phone: z.string(),
  id: z.string(),
});
