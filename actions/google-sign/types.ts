import { z } from "zod";
import { GoogleSignIn } from "./schema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof GoogleSignIn>;
export type ReturnType = ActionState<InputType, { uid: string; name: string | null; email: string | null }>;
