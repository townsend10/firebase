import { z } from "zod";
import { DeletePrescription } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Pacient } from "@/types";
import { DocumentData } from "firebase/firestore";
export type InputType = z.infer<typeof DeletePrescription>;
export type ReturnType = ActionState<InputType, { id: string }>;
