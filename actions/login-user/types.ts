import { z } from "zod";
import { LoginUser } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { User } from "firebase/auth";

export type InputType = z.infer<typeof LoginUser>;
export type ReturnType = ActionState<InputType, any>;
