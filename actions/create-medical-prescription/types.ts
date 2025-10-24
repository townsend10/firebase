import { z } from "zod";
import { CreateMedicalPrescription } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Pacient, Prescription } from "@/types";
export type InputType = z.infer<typeof CreateMedicalPrescription>;
export type ReturnType = ActionState<InputType, Prescription>;
