import { z } from "zod";

export const DeletePrescription = z.object({
  id: z.string(),
});
