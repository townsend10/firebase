import { z } from "zod";
import { CreateGuestUser } from "./schema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof CreateGuestUser>;
export type ReturnType = ActionState<InputType, any>;
