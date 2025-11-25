import { z } from "zod";

// Função para validar CPF
const validateCPF = (cpf: string): boolean => {
  // Remove formatação
  cpf = cpf.replace(/[^\d]/g, "");

  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;

  return true;
};

export const CreatPacientMedic = z.object({
  name: z
    .string({
      required_error: "Nome obrigatório",
      invalid_type_error: "Nome obrigatório",
    })
    .min(3, {
      message: "Digite seu nome completo (mínimo 3 caracteres)",
    }),
  email: z
    .string({
      required_error: "Email obrigatório",
      invalid_type_error: "Email obrigatório",
    })
    .email({ message: "Digite um email válido" }),
  birthdayDate: z.string({
    required_error: "Data de nascimento obrigatória",
    invalid_type_error: "Data de nascimento obrigatória",
  }),

  cpf: z
    .string({
      required_error: "CPF obrigatório",
      invalid_type_error: "CPF obrigatório",
    })
    .min(11, {
      message: "CPF deve ter 11 dígitos",
    })
    .max(14, {
      message: "CPF inválido",
    })
    .refine(
      (cpf) => {
        // Remove formatação e valida
        const cleanCpf = cpf.replace(/[^\d]/g, "");
        return validateCPF(cleanCpf);
      },
      {
        message: "CPF inválido",
      }
    ),

  phone: z
    .string({
      required_error: "Telefone obrigatório",
      invalid_type_error: "Telefone obrigatório",
    })
    .min(10, {
      message: "Telefone deve ter no mínimo 10 dígitos",
    })
    .max(15, {
      message: "Telefone inválido",
    }),
});
