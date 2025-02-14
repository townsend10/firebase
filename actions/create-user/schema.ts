import { z } from "zod";

export const CreateUser = z
  .object({
    email: z.string({
      required_error: "Email obrigatorio",
      invalid_type_error: "Email obrigatorio",
      message: "Email obrigatorio",
    }),
    password: z
      .string({
        required_error: "Senha obrigatoria",
        invalid_type_error: "Senha obrigatoria",
      })
      .min(8, "Coloque uma senha de no minimo 8 caracteres"),

    name: z.string({
      required_error: "Senha obrigatoria",
      invalid_type_error: "Senha obrigatoria",
    }),

    phone: z.string({
      required_error: "Telefone obrigatorio",
      invalid_type_error: "Telefone obrigatorio",
      message: "Coloque um telefone",
    }),
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
