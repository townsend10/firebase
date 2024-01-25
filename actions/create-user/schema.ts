import { z } from "zod";

export const CreateUser = z.object({
  email: z.string({
    required_error: "Email obrigatorio",
    invalid_type_error: "Email obrigatorio",
  }),
  password: z.string({
    required_error: "Senha obrigatoria",
    invalid_type_error: "Senha obrigatoria",
  }),
  name: z.string({
    required_error: "Senha obrigatoria",
    invalid_type_error: "Senha obrigatoria",
  }),

  phone: z.string({
    required_error: "Senha obrigatoria",
    invalid_type_error: "Senha obrigatoria",
  }),
});
