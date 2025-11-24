import { z } from "zod";

export const GetPrescription = z.object({
  content: z.string(),
  id: z.string(),
  name: z.string(),
  date: z.coerce.date({
    required_error: "Data obrigatoria",
    invalid_type_error: "Data inválida",
  }),
  days: z.number({
    required_error: "Digite um numero",
    invalid_type_error: "Digite um invalido",
  }),
});
