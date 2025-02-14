import { z } from "zod";
import { CreateSchedule } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Schedule } from "@/types";
export type InputType = z.infer<typeof CreateSchedule>;
export type ReturnType = ActionState<InputType, Schedule>;
