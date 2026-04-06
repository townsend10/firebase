import { z } from "zod";

export const CreateSchedule = z.object({
  pacientId: z.string().min(1, "ID do paciente é obrigatório"),
  date: z
    .string({ required_error: "Insira uma data" })
    .min(1, "Data é obrigatória"),
  hour: z
    .string({
      required_error: "Defina uma hora",
    })
    .min(1, "Hora é obrigatória"),
  status: z.enum(["confirm", "cancelled", "waiting", "none"]).optional(), // Opcional, será calculado automaticamente
  userId: z.string().optional(), // For tracking who created the appointment
  userRole: z.enum(["admin", "guest"]).optional(), // For validation rules
});
