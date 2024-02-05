import { z } from "zod";

export const DeletePatients = z.object({
  name: z.string(),
  email: z.string(),

  birthdayDate: z.string(),

  cpf: z.string(),
  phone: z.string(),
  id: z.string(),
});
