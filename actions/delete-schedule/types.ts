import { z } from "zod";
import { DeleteSchedule } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Pacient } from "@/types";
import { DocumentData } from "firebase/firestore";
export type InputType = z.infer<typeof DeleteSchedule>;
export type ReturnType = ActionState<InputType, void>;
