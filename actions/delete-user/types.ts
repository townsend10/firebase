import { z } from "zod";
import { DeleteUser } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Pacient } from "@/types";
import { DocumentData } from "firebase/firestore";
export type InputType = z.infer<typeof DeleteUser>;
export type ReturnType = ActionState<InputType, void>;
