import { z } from "zod";

export const CreateMedicalPrescription = z.object({
  name: z
    .string({
      required_error: "Nome obrigatoria",
      invalid_type_error: "Nome obrigatoria",
    })
    .min(2, {
      message: "Digite seu nome e sobrenome",
    }),
  date: z.coerce.date({
    required_error: "Data obrigatoria",
    invalid_type_error: "Data inválida",
  }),
  // content: z.string({
  //   required_error: "Nome obrigatorio",
  //   invalid_type_error: "Conteudo errado",
  // }),
  days: z.number({
    required_error: "Digite um numero",
    invalid_type_error: "Digite um invalido",
  }),
  pacientId: z.string().optional(), // ID do paciente para vincular ao usuário
});
