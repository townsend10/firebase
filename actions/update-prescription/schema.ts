import { z } from "zod";

export const UpdatePrescription = z.object({
  id: z
    .string({
      required_error: "Nome obrigatoria",
      invalid_type_error: "Nome obrigatoria",
    })
    .min(2, {
      message: "BOTA NOME PORRA",
    }),
  content: z
    .string({
      required_error: "Nome obrigatoria",
      invalid_type_error: "Nome obrigatoria",
    })
    .min(2, {
      message: "BOTA NOME PORRA",
    }),
  date: z.coerce.date({
    required_error: "Data obrigatoria",
    invalid_type_error: "Data inválida",
  }),
  days: z.number({
    required_error: "Digite um numero",
    invalid_type_error: "Digite um invalido",
  }),
   name: z.string({
    required_error: "Digite um numero",
    invalid_type_error: "Digite um invalido",
  }),

});
