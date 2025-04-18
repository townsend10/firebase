import { z } from "zod";
import { getUser } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Pacient } from "@/types";
import { DocumentData } from "firebase/firestore";
export type InputType = z.infer<typeof getUser>;
export type ReturnType = ActionState<InputType, any>;
