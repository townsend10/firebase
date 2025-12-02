import { z } from "zod";

export const GetGuests = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  birthdayDate: z.string().optional(),
  cpf: z.string().optional(),
  phone: z.string().optional(),
  id: z.string().optional(),
});
