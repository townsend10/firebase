import { z } from "zod";

export const CreatPacientMedic = z.object({
  name: z
    .string({
      required_error: "Nome obrigatoria",
      invalid_type_error: "Nome obrigatoria",
    })
    .min(2, {
      message: "BOTA NOME PORRA",
    }),
  email: z
    .string({
      required_error: "Email obrigatorio",
      invalid_type_error: "Email obrigatorio",
    })
    .min(2, {
      message: "ASDASD",
    }),
  birthdayDate: z.string({
    required_error: "Data de aniversario obrigatorio",
    invalid_type_error: "Data de aniversario obrigatorio",
  }),

  cpf: z.string({
    required_error: "CPF obrigatorio",
    invalid_type_error: "CPF obrigatorio",
  }),

  phone: z.string({
    required_error: "Telefone obrigatoria",
    invalid_type_error: "Telefone obrigatoria",
  }),
});
