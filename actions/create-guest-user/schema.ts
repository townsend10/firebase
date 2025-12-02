import { z } from "zod";

export const CreateGuestUser = z.object({
  name: z
    .string({
      required_error: "Nome é obrigatório",
    })
    .min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  cpf: z.string().optional(),
  birthdayDate: z.string().optional(),
});
