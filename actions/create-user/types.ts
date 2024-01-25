import { z } from "zod";
import { CreateUser } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { User } from "firebase/auth";

export type InputType = z.infer<typeof CreateUser>;
export type ReturnType = ActionState<InputType, User>;
