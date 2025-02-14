import { z } from "zod";

export const UpdateSchedule = z.object({
  id: z
    .string({
      required_error: "Nome obrigatoria",
      invalid_type_error: "Nome obrigatoria",
    })
    .min(2, {
      message: "BOTA NOME PORRA",
    }),
  date: z
    .string({
      required_error: "Coloque um preço",
      invalid_type_error: "Coloque um preço",
    })
    .min(2, {
      message: "preço",
    }),
  hour: z.string({
    required_error: "Email obrigatorio",
    invalid_type_error: "Email obrigatorio",
  }),
  status: z.string({
    required_error: "Data de aniversario obrigatorio",
    invalid_type_error: "Data de aniversario obrigatorio",
  }),
});
