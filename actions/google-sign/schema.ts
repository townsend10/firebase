import { z } from "zod";

export const GoogleSignIn = z.object({
  idToken: z.string({
    required_error: "Token obrigatório",
  }).min(1, "Token obrigatório"),
  name: z.string().nullish(),
  email: z.string().nullish(),
});
