import { z } from "zod";
import { UpdatePrescription } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Pacient } from "@/types";
export type InputType = z.infer<typeof UpdatePrescription>;
export type ReturnType = ActionState<InputType, any>;
