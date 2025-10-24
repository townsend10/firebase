import { z } from "zod";

export const GetPacient = z.object({
  name: z.string(),
  email: z.string(),

  birthdayDate: z.string().optional(),

  cpf: z.string(),
  phone: z.string(),
  id: z.string(),
});
