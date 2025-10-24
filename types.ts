export type Pacient = {
  id?: string;
  name: string;
  email: string;
  birthdayDate: string;
  phone: string;
  cpf: string;
};

export type User = {
  id?: string;
  name: string;
  phone: string;
};

export type Prescription = {
  name: string;
  date: Date;
  content?: string;
  days: number;
};
export type Schedule = {
  id?: string;
  pacientId: string;
  date: string;
  hour: string;
  status: "confirm" | "waiting" | "cancelled" | "none";
};

export enum Direction {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  gameOver: boolean;
  score: number;
  speed: number;
  isPaused: boolean;
  isStarted: boolean;
}
