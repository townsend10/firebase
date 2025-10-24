import { z } from "zod";
import { GetPrescription } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Pacient } from "@/types";
import { DocumentData } from "firebase/firestore";
export type InputType = z.infer<typeof GetPrescription>;
export type ReturnType = ActionState<InputType, any>;
