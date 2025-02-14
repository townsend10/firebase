import { z } from "zod";
import { GetSchedules } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Pacient } from "@/types";
import { DocumentData } from "firebase/firestore";
export type InputType = z.infer<typeof GetSchedules>;
export type InputType2 = any;
export type ReturnType = ActionState<InputType, DocumentData[]>;
