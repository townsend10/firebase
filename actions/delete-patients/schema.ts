import { z } from "zod";

export const DeletePatients = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  birthdayDate: z.string().optional(),
  cpf: z.string().optional(),
  phone: z.string().optional(),
  id: z.string(),
  userId: z.string().min(1, "UserId obrigatório"),
});
