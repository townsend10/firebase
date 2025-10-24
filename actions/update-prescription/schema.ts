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
});
