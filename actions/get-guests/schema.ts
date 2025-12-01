import { z } from "zod";

export const GetGuests = z.object({
  name: z.string(),
  email: z.string(),

  birthdayDate: z.string(),

  cpf: z.string(),
  phone: z.string(),
  id: z.string().optional(),
});
