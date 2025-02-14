import { z } from "zod";
import { UpdateSchedule } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Pacient } from "@/types";
export type InputType = z.infer<typeof UpdateSchedule>;
export type ReturnType = ActionState<InputType, any>;
