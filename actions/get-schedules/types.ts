import { z } from "zod";
import { GetSchedules } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { DocumentData } from "firebase/firestore";

export type InputType = z.infer<typeof GetSchedules>;
export type InputType2 = any;

export interface Schedule {
  id: string;
  date: string;
  hour: string;
  status: string;
  pacientId: string;
  created_at?: any;
  pacientName: string;
}

export type ReturnType = ActionState<InputType, Schedule[]>;
