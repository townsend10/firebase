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

export const CreateUser = z
  .object({
    email: z
      .string({
        required_error: "Email obrigatório",
        invalid_type_error: "Email obrigatório",
      })
      .email("Digite um email válido"),
    password: z
      .string({
        required_error: "Senha obrigatória",
        invalid_type_error: "Senha obrigatória",
      })
      .min(8, "Coloque uma senha de no mínimo 8 caracteres"),

    name: z
      .string({
        required_error: "Nome obrigatório",
        invalid_type_error: "Nome obrigatório",
      })
      .min(3, "Nome deve ter no mínimo 3 caracteres"),

    phone: z
      .string({
        required_error: "Telefone obrigatório",
        invalid_type_error: "Telefone obrigatório",
      })
      .min(10, "Telefone deve ter no mínimo 10 dígitos")
      .max(15, "Telefone inválido"),

    cpf: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true; // Se não preenchido, é válido (opcional)
          return validateCPF(val);
        },
        {
          message: "CPF inválido",
        }
      ),

    imageFile: z.any(),
  })
  .superRefine(({ password }, checkPassComplexity) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) =>
      /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0;
    for (let i = 0; i < password.length; i++) {
      let ch = password.charAt(i);
      if (!isNaN(+ch)) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
      else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }
    if (
      countOfLowerCase < 1 ||
      countOfUpperCase < 1 ||
      countOfSpecialChar < 1 ||
      countOfNumbers < 1
    ) {
      checkPassComplexity.addIssue({
        code: "custom",
        message:
          "Senha deve conter 8 digitos com letra maiuscula no começo e um caracter especial",
        path: ["password"],
      });
    }
  });
