import { z } from "zod";
import { GetPrescriptions } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Pacient } from "@/types";
import { DocumentData } from "firebase/firestore";
export type InputType = z.infer<typeof GetPrescriptions>;
export type ReturnType = ActionState<InputType, DocumentData[]>;
