import { z } from "zod";
import { GetGuests } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { DocumentData } from "firebase/firestore";

export type InputType = z.infer<typeof GetGuests>;
export type ReturnType = ActionState<InputType, DocumentData[]>;
