import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { GetAllPrescriptions } from "./schema";

export type InputType = z.infer<typeof GetAllPrescriptions>;
export type ReturnType = ActionState<
  InputType,
  {
    id: string;
    name: string;
    content: string;
    date: Date;
    days: number;
    userId: string;
  }[]
>;
