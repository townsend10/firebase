import { z } from "zod";
import { UpdatePacient } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Pacient } from "@/types";
export type InputType = z.infer<typeof UpdatePacient>;
export type ReturnType = ActionState<InputType, any>;
